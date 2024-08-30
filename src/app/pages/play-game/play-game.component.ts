import {Component, inject} from "@angular/core";
import {GameboardComponent} from "../../components/gameboard/gameboard.component";
import {UserSessionService} from "../../injectables/user-session.service";
import {DecimalPipe, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {GameShipComponent} from "../../components/game-ship/game-ship.component";
import {ShipDragAndDropService} from "../../injectables/ship-drag-and-drop.service";

@Component({
  selector: "app-play-game",
  templateUrl: "./play-game.component.html",
  styleUrl: "./play-game.component.scss",
  imports: [
    GameboardComponent,
    DecimalPipe,
    NgIf,
    GameShipComponent,
  ],
  standalone: true
})
export class PlayGameComponent {


  // services
  private router = inject(Router);
  protected userSessions = inject(UserSessionService);
  protected ships = inject(ShipDragAndDropService);


  // internal state
  async handleExit() {
    this.ships.doneCloseDestroy();
    await this.userSessions.endSession();
    this.router.navigate(['/'])
  }

  handleStartGame() {
    for (const [shipNum, tiles] of this.ships.shipLocations) {
      console.log(`ship 1x${shipNum} covers ${tiles}`)
    }
    this.ships.confirm();
  }
}
