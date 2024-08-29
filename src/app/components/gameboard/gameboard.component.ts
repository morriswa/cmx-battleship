import {Component} from "@angular/core";
import {GameTileComponent} from "../game-tile/game-tile.component";
import {CdkDragDrop, CdkDropList} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  standalone: true,
  imports: [
    GameTileComponent,
    CdkDropList
  ],
  styleUrl: "./gameboard.component.scss"
})
export class GameboardComponent {
  cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  rows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  drop(event: any) {
    console.log(event)
  }
}
