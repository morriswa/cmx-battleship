import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  ViewChild
} from "@angular/core";
import {GameDragAndDropService} from "../../injectables/game-drag-and-drop.service";
import {NgClass, NgIf} from "@angular/common";


@Component({
  selector: 'app-game-tile',
  templateUrl: './game-tile.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  styleUrl: "./game-tile.component.scss"
})
export class GameTileComponent {

  dnd = inject(GameDragAndDropService);


  @Input() tileId!: string;

  @ViewChild("gameTile") gameTile!: ElementRef;

  gameTileLocX?: number;
  gameTileLocY?: number;

  detectTileLocationChange() {
    const gameTileLocation = this.gameTile.nativeElement.getBoundingClientRect();
    this.gameTileLocX = gameTileLocation.x;
    this.gameTileLocY = gameTileLocation.y;
    this.dnd.setTileLocations(this.tileId, {
      xStart: this.gameTileLocX!,
      xEnd: this.gameTileLocX!,
      yStart: this.gameTileLocY!,
      yEnd: this.gameTileLocY!,
    });
  }

  @HostListener("window:resize", ["$event"])
  onResizeScreen() {
    this.detectTileLocationChange();
  }

  ngAfterViewChecked(): void {
    this.detectTileLocationChange();
  }


  constructor() {

  }

  // detect mousedown events on game-tile
  @HostListener('mousedown') onClick() {
    // execute every click
    console.log(`click detected ${this.tileId}`);
  }

}
