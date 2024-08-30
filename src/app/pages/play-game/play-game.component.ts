import {AfterViewInit, Component, inject} from "@angular/core";
import {GameboardComponent} from "../../components/gameboard/gameboard.component";
import {LobbyService} from "../../injectables/lobby.service";
import {DecimalPipe, NgIf, NgStyle, NgTemplateOutlet} from "@angular/common";
import {Router} from "@angular/router";
import {ShipDragAndDropService} from "../../injectables/ship-drag-and-drop.service";
import {GameShipSpacerComponent} from "../../components/game-ship/spacer/game-ship-spacer.component";
import {GameShipDraggableComponent} from "../../components/game-ship/draggable/game-ship-draggable.component";
import {GameShipComponent} from "../../components/game-ship/game-ship.component";
import {ActiveGameService} from "../../injectables/active-game.service";

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
export class PlayGameComponent implements AfterViewInit {


  // services
  private router = inject(Router);
  protected userSessions = inject(LobbyService);
  protected game = inject(ActiveGameService);
  protected shipSelection = inject(ShipDragAndDropService);


  // lifecycle
  ngAfterViewInit(): void {
    this.shipSelection.resetShipSelectorService();
    this.userSessions.getAvailablePlayers()
      .then((players: any) => {console.log(players)})
  }


  // action handlers
  async handleExit() {
    this.router.navigate(['/'])
    this.shipSelection.resetShipSelectorService();
    this.game.resetActiveGameService();
    await this.userSessions.leaveLobby();
  }

  async handleStartGame() {
    await this.game.markBoardWithShips(this.shipSelection.shipLocations);
    this.shipSelection.confirmAndHideShips();
  }
}
