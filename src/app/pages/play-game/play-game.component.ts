import {Component, inject, OnInit, signal, WritableSignal} from "@angular/core";
import {GameboardComponent} from "../../components/gameboard/gameboard.component";
import {LobbyService} from "../../services/lobby.service";
import {DecimalPipe, NgIf, NgStyle, NgTemplateOutlet} from "@angular/common";
import {Router} from "@angular/router";
import {ShipDragAndDropService} from "../../services/ship-drag-and-drop.service";
import {GameShipSpacerComponent} from "../../components/game-ship/spacer/game-ship-spacer.component";
import {GameShipDraggableComponent} from "../../components/game-ship/draggable/game-ship-draggable.component";
import {GameShipComponent} from "../../components/game-ship/game-ship.component";
import {ActiveGameService} from "../../services/active-game.service";
import {sleep} from "../../utils";

@Component({
  selector: "app-play-game",
  templateUrl: "./play-game.component.html",
  styleUrl: "./play-game.component.scss",
  imports: [
    GameboardComponent,
    DecimalPipe,
    NgIf,
    GameShipDraggableComponent,
    NgStyle,
    NgTemplateOutlet,
    GameShipSpacerComponent,
    GameShipComponent,
  ],
  standalone: true
})
export class PlayGameComponent implements OnInit {


  // services
  private router = inject(Router);
  protected userSessions = inject(LobbyService);
  protected game = inject(ActiveGameService);
  protected shipSelection = inject(ShipDragAndDropService);

  private _currentlyPollingGameStatus: WritableSignal<boolean> = signal(false);

  // lifecycle
  ngOnInit() {
    this.game.getGameState().then((state)=>{
      // console.log('running game', state)

      if (!this.game.doneWithSelection) {
        this.shipSelection.showShipsAndEnableTileFeedback();
      }

    });

    setTimeout(()=>this.pollGameStatus(), 1000)
  }


  // action handlers
  async handleExit() {
    await this.game.forfeitGame()
    this.router.navigate(['/lobby'])
    this.shipSelection.resetShipSelectorService();
    this.game.resetActiveGameService();
  }

  async handleStartGame() {
    await this.game.startGame(this.shipSelection.shipLocations);
    this.shipSelection.submitAndHideShips();
  }

  async pollGameStatus() {
    if (!this._currentlyPollingGameStatus()) this._currentlyPollingGameStatus.set(true);
    else {
      return;
    }
    while (this._currentlyPollingGameStatus()) {
      this.updateGameStatus();

      await sleep(10_000);
    }
  }

  private async updateGameStatus() {
    const state = await this.game.getGameState()
    if (!state) {
      this.router.navigate(['/lobby']);
      return;
    }
    else {
      this.game.setGameState(state);
    }

    if (this.game.doneWithSelection) {
      this.shipSelection.resetShipSelectorService()
    }

    if (this.game.phase==='nowin') {
      this.router.navigate(['/lobby'])
    }
  }

  stopPollingGameStatus() {
    this._currentlyPollingGameStatus.set(false);
  }

  async handleMakeSelection() {
    console.log(`selected ${this.game.currentSelection}`)
    if (this.game.currentSelection && this.game.activeTurn) {
      const state = await this.game.commitMove();
      this.game.setGameState(state);
    } else {
      throw new Error('cannot play if its not your turn')
    }
  }
}
