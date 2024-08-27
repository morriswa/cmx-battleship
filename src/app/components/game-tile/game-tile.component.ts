import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-game-tile',
  templateUrl: './game-tile.component.html',
  standalone: true,
  styleUrl: "./game-tile.component.scss"
})
export class GameTileComponent {
  @Input() tileId!: string;
}
