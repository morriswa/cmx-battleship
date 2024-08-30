import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  Renderer2,
  ViewChild
} from "@angular/core";
import {GameDragAndDropService} from "../../injectables/game-drag-and-drop.service";
import {NgClass, NgIf} from "@angular/common";
import {sleep} from "../../utils";


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
export class GameTileComponent implements AfterViewInit {

  dnd = inject(GameDragAndDropService);
  private _render = inject(Renderer2);

  theLoop = true;

  ngAfterViewInit(): void {
    this.detectTileLocationChange();
    // console.log(this.gameTile)
    this.dnd.start();
  }

  constructor() {
    this.loop();
    this.dnd.resetSignal.subscribe(()=>this.theLoop = false);
  }

  async loop() {
    while (this.theLoop) {
      if (this.tileId && this.dnd.ready() && this.gameTile) {
        this._render.removeClass(this.gameTile.nativeElement, 'game-tile-covered');

        if (this.dnd.computeCoveredTiles().get(this.tileId)?.covered) {
          this._render.addClass(this.gameTile.nativeElement, 'game-tile-covered');
        }
      }

      // this.dnd.duplicateScan();

      await sleep(100);
    }
    this._render.removeClass(this.gameTile.nativeElement, 'game-tile-covered');
  }

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
      xEnd: this.gameTileLocX! + 50,
      yStart: this.gameTileLocY!,
      yEnd: this.gameTileLocY! + 50,
    });
  }

  @HostListener("window:resize", ["$event"])
  onResizeScreen() {
    this.detectTileLocationChange();
  }

  // detect mousedown events on game-tile
  @HostListener('mousedown') onClick() {
    // execute every click
    console.log(`click detected ${this.tileId}`);
  }
}
