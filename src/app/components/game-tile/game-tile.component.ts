import {Component, Input} from "@angular/core";
import {GameTileDirective} from "../../directives/game-tile.directive";

@Component({
  selector: 'app-game-tile',
  templateUrl: './game-tile.component.html',
  standalone: true,
  imports: [
    GameTileDirective
  ],
  styleUrl: "./game-tile.component.scss"
})
export class GameTileComponent {
  @Input() tileId!: string;
}
