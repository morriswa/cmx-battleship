import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  Renderer2,
  signal,
  ViewChild,
  WritableSignal
} from "@angular/core";
import {ShipDragAndDropService} from "../../injectables/ship-drag-and-drop.service";
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

  // io
  @Input() tileId!: string;

  // services
  private ships = inject(ShipDragAndDropService);
  private _render = inject(Renderer2);

  // internal state
  @ViewChild("gameTile") gameTile!: ElementRef;
  private watchShips = signal(true);
  private gameTileLocX: WritableSignal<number | undefined> = signal(undefined);
  private gameTileLocY: WritableSignal<number | undefined> = signal(undefined);

  // init / lifecycle
  constructor() {
    this.startWatchingShips()
      .then(()=>this.stopWatchingShips());
    this.ships.placementComplete.subscribe(()=>this.watchShips.set(false));
  }

  ngAfterViewInit(): void {
    this.detectTileLocationChange();
  }

  // public
  async startWatchingShips() {
    while (this.watchShips()) {
      if (this.tileId && this.gameTile) {
        this._render.removeClass(this.gameTile.nativeElement, 'game-tile-covered');

        if (this.ships.coveredTiles.get(this.tileId)?.covered) {
          this._render.addClass(this.gameTile.nativeElement, 'game-tile-covered');
        }
      }

      await sleep(100);
    }
  }

  stopWatchingShips() {
    this.watchShips.set(false);
    this._render.removeClass(this.gameTile.nativeElement, 'game-tile-covered');
  }

  // internal logic
  @HostListener("window:resize", ["$event"])
  onResizeScreen() {
    this.ships.resetShipLocations();
    this.detectTileLocationChange();
  }

  // detect mousedown events on game-tile
  @HostListener('mousedown') onClick() {
    // execute every click
    console.log(`click detected ${this.tileId}`);
  }

  private detectTileLocationChange() {
    const gameTileLocation = this.gameTile.nativeElement.getBoundingClientRect();
    const x = gameTileLocation.x;
    const y = gameTileLocation.y;
    this.gameTileLocX.set(x);
    this.gameTileLocY.set(y);
    // TODO get '50' offset from scss
    this.ships.setTileLocations(this.tileId, {
      xStart: x,
      xEnd: x + 50,
      yStart: y,
      yEnd: y + 50,
    });
  }

}
