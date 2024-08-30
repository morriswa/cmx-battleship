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
} from "@angular/core";
import {ShipDragAndDropService} from "../../injectables/ship-drag-and-drop.service";
import {NgClass, NgIf} from "@angular/common";
import {sleep} from "../../utils";
import {ActiveGameService} from "../../injectables/active-game.service";


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
  private games = inject(ActiveGameService);
  private renderer = inject(Renderer2);

  // internal state
  @ViewChild("gameTile") gameTile!: ElementRef;
  private watchShips = signal(true);
  private watchGame = signal(false);

  // init / lifecycle
  constructor() {
    // watch for incoming events from ship selection
    this.ships.event.subscribe((e)=>{
      if (e.type==="SUBMIT") {
        this.stopWatchingShips();

        this.startWatchingGameTiles();

      } else if (e.type==="RESET") {
        this.startWatchingShips();
      }
    });

    // watch for incoming events from game runner
    this.games.event.subscribe((e)=>{

    });
  }

  ngAfterViewInit(): void {
    this.detectTileLocationChange();
  }

  // public
  async startWatchingShips() {
    if (!this.watchShips()) this.watchShips.set(true);
    while (this.watchShips()) {
      if (this.tileId && this.gameTile) {
        this.renderer.removeClass(this.gameTile.nativeElement, 'game-tile-covered');

        if (this.ships.coveredTiles.get(this.tileId)?.covered) {
          this.renderer.addClass(this.gameTile.nativeElement, 'game-tile-covered');
        }
      }

      await sleep(100);
    }
  }

  async startWatchingGameTiles() {
    if (!this.watchGame()) this.watchGame.set(true);
    while (this.watchGame()) {
      if (this.games.ownTiles.includes(this.tileId)) {
        this.renderer.addClass(this.gameTile.nativeElement, 'game-tile-ship-permanent');
      }

      await sleep(100);
    }
  }

  stopWatchingShips() {
    this.watchShips.set(false);
    this.renderer.removeClass(this.gameTile.nativeElement, 'game-tile-covered');
  }

  // internal logic
  @HostListener("window:resize", ["$event"])
  onResizeScreen() {
    this.detectTileLocationChange();
    if (this.ships.active) {
      this.ships.resetShipLocations();
    }
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
    this.ships.setTileLocations(this.tileId, {
      xStart: x,
      xEnd: x + gameTileLocation.width,
      yStart: y,
      yEnd: y + gameTileLocation.height,
    });
  }


}
