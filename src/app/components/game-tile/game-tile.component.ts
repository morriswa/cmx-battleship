import {Component, HostListener, Input} from "@angular/core";

@Component({
  selector: 'app-game-tile',
  templateUrl: './game-tile.component.html',
  standalone: true,
  imports: [],
  styleUrl: "./game-tile.component.scss"
})
export class GameTileComponent {
  @Input() tileId!: string;

  // detect mousedown events on game-tile
  @HostListener('mousedown') onClick() {
    // execute every click
    console.log(`click detected ${this.tileId}`);
  }
}
