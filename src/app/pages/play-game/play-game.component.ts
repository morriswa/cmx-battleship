import {Component, inject} from "@angular/core";
import {GameboardComponent} from "../../components/gameboard/gameboard.component";
import {UserSessionService} from "../../injectables/user-session.service";
import {DecimalPipe, NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: "app-play-game",
  templateUrl: "./play-game.component.html",
  styleUrl: "./play-game.component.scss",
  imports: [
    GameboardComponent,
    DecimalPipe,
    NgIf
  ],
  standalone: true
})
export class PlayGameComponent {
  uss = inject(UserSessionService);
  router = inject(Router);

  async handleExit() {
    await this.uss.endSession();
    this.router.navigate(['/'])
  }
}
