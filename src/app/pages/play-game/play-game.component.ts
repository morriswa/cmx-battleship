import {Component} from "@angular/core";
import {GameboardComponent} from "../../components/gameboard/gameboard.component";

@Component({
  selector: "app-play-game",
  templateUrl: "./play-game.component.html",
  styleUrl: "./play-game.component.scss",
  imports: [
    GameboardComponent
  ],
  standalone: true
})
export class PlayGameComponent { }
