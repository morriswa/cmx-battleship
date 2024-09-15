import {Component} from "@angular/core";
import {GameTileComponent} from "../game-tile/game-tile.component";

/*
  This component that is used to create the 10x10 grid.
  Has the max number of cols and rows, this is used in the html file to display it on the page using for loops.
*/

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  standalone: true,
  imports: [
    GameTileComponent,
  ],
  styleUrl: "./gameboard.component.scss"
})
export class GameboardComponent {
  cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  rows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
}
