import {Component, computed, inject, OnInit, signal, WritableSignal} from "@angular/core";
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
  endGameMessage = () => {
    if (this.game.session && this.game.phase === `${this.game.session.player_one_or_two}win`) {
      return "You win!"
    } else if (this.game.phase === 'nowin') {
      return "Incomplete Match"
    } else {
      return "You Lose"
    }
  };


  // lifecycle
  ngOnInit() {
    this.game.resetActiveGameService();

    this.pollGameStatus();

    const tnt = () => {
      if (this.game.phase==='selct'&&!this.game.doneWithSelection) {
        this.shipSelection.showShipsAndEnableTileFeedback();
      } else {
        setTimeout(tnt, 1000)
      }
    };

    tnt();
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
      const state = await this.game.refreshGameSession();
      if (!state) {
        this.router.navigate(['/lobby']);
        return;
      }

      if (this.game.doneWithSelection) {
        this.shipSelection.resetShipSelectorService()
      }

      if (this.game.phase==='nowin') {
        this.router.navigate(['/lobby'])
      }

      await sleep(3_000);
    }
  }

  stopPollingGameStatus() {
    this._currentlyPollingGameStatus.set(false);
  }

  async handleMakeSelection() {
    console.log(`selected ${this.game.currentSelection}`)
    if (this.game.currentSelection && this.game.activeTurn) {
      await this.game.commitMove();
    } else {
      throw new Error('cannot play if its not your turn')
    }
  }
}
