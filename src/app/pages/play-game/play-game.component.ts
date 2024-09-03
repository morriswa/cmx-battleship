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

  waiting = signal(true);
  gameStatus: WritableSignal<string> = signal('unknown');
  private _currentlyPollingGameStatus: WritableSignal<boolean> = signal(false);

  // lifecycle
  ngOnInit() {
    this.game.getGameState().then((state)=>{
      console.log('running game', state)
    });
    this.shipSelection.showShipsAndEnableTileFeedback();
    setTimeout(()=>this.pollGameStatus(), 1000)
  }


  // action handlers
  async handleExit() {
    this.router.navigate(['/'])
    this.shipSelection.resetShipSelectorService();
    this.game.resetActiveGameService();
    await this.userSessions.leaveLobby();
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
      const state = await this.game.getGameState()
      if (state.game_phase!=='selct') this.waiting.set(false);
      this.gameStatus.set(state.game_phase);
      await sleep(10_000);
    }
  }

  stopPollingGameStatus() {
    this._currentlyPollingGameStatus.set(false);
  }

}
