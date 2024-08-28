import {Component, inject} from "@angular/core";
import {GameboardComponent} from "../../components/gameboard/gameboard.component";
import {UserSessionService} from "../../injectables/user-session.service";
import {DecimalPipe, NgIf} from "@angular/common";

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
}
