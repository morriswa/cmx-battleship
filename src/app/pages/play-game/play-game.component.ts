import {Component, inject} from "@angular/core";
import {GameboardComponent} from "../../components/gameboard/gameboard.component";
import {UserSessionService} from "../../injectables/user-session.service";
import {DecimalPipe, NgIf, NgStyle, NgTemplateOutlet} from "@angular/common";
import {Router} from "@angular/router";
import {ShipDragAndDropService} from "../../injectables/ship-drag-and-drop.service";
import {GameShipSpacerComponent} from "../../components/game-ship/spacer/game-ship-spacer.component";
import {GameShipDraggableComponent} from "../../components/game-ship/draggable/game-ship-draggable.component";
import {GameShipComponent} from "../../components/game-ship/game-ship.component";

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
export class PlayGameComponent {


  // services
  private router = inject(Router);
  protected userSessions = inject(UserSessionService);
  protected shipSelection = inject(ShipDragAndDropService);


  // internal state
  async handleExit() {
    this.shipSelection.doneCloseDestroy();
    await this.userSessions.endSession();
    this.router.navigate(['/'])
  }

  handleStartGame() {
    for (const [shipNum, tiles] of this.shipSelection.shipLocations) {
      console.log(`ship 1x${shipNum} covers ${tiles}`)
    }
    this.shipSelection.confirm();
  }
}
