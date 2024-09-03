import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input, OnDestroy, OnInit,
  Renderer2,
  signal,
  ViewChild,
} from "@angular/core";
import {ShipDragAndDropService} from "../../services/ship-drag-and-drop.service";
import {NgClass, NgIf} from "@angular/common";
import {sleep} from "../../utils";
import {ActiveGameService} from "../../services/active-game.service";
import {Subscription} from "rxjs";


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
export class GameTileComponent implements OnInit, AfterViewInit, OnDestroy {


  // io
  @Input() tileId!: string;


  // services
  private ships = inject(ShipDragAndDropService);
  private games = inject(ActiveGameService);
  private renderer = inject(Renderer2);


  // internal state
  @ViewChild("gameTile") gameTile?: ElementRef;
  private _watchShips = signal(false);
  private _watchGameTile = signal(false);
  private _shipSelectorSubscription?: Subscription;
  private _activeGameSubscription?: Subscription;


  // init / lifecycle
  ngOnInit() {
    // watch for incoming events from ship selector
    this._shipSelectorSubscription = this.ships.event.subscribe(async (e)=>{
      if (e.type==="SUBMIT") {
        this.stopWatchingShips();
      } else if (e.type==="RESET") {
        this.stopWatchingShips()
      } else if (e.type==="READYUP") {
        await this.startWatchingShips();
      }
    });

    // watch for incoming events from game runner
    this._activeGameSubscription = this.games.event.subscribe((e)=>{
      if (e.type==="updateState") {
        this._update_tile();
      }
    });
  }

  ngAfterViewInit() {
    this.detectTileLocationChange();
  }

  ngOnDestroy(): void {
    this._shipSelectorSubscription?.unsubscribe();
    this._activeGameSubscription?.unsubscribe();
  }

  // public
  async startWatchingShips() {
    if (!this._watchShips()) this._watchShips.set(true);
    else {
      console.log('refused to start watch ships twice');
      return;
    }
    console.log('ship loop init')
    while (this._watchShips()) {
      // if (this.tileId && this.gameTile) {
      //   this.renderer.removeClass(this.gameTile.nativeElement, 'game-tile-covered');
      //
      //   if (this.ships.coveredTiles.get(this.tileId)?.covered) {
      //     this.renderer.addClass(this.gameTile.nativeElement, 'game-tile-covered');
      //   }
      //
      //
      // }

      await this._update_tile();
      await sleep(100);
    }
    console.log('ship loop destroyed')
  }

  // async startWatchingGameTile() {
  //   if (!this._watchGameTile()) this._watchGameTile.set(true);
  //   else {
  //     console.log('refused to start game loop twice');
  //     return;
  //   }
  //   console.log('game loop init');
  //   while (this._watchGameTile()) {
  //     if (this.gameTile && this.games.ownTiles.includes(this.tileId)) {
  //       this.renderer.addClass(this.gameTile?.nativeElement, 'game-tile-ship-permanent');
  //     }
  //
  //     await sleep(100);
  //   }
  //   console.log('ship loop destroyed')
  // }

  async _update_tile() {
    if (this.gameTile) {

      if (this.ships.active) {
        if (this.tileId && this.gameTile) {
          if (this.ships.coveredTiles.get(this.tileId)?.covered) {
            this.renderer.addClass(this.gameTile.nativeElement, 'game-tile-covered');
          } else {
            this.renderer.removeClass(this.gameTile.nativeElement, 'game-tile-covered');
          }
        }
      } else if (this.games.doneWithSelection) {

        this.renderer.removeClass(this.gameTile.nativeElement, 'game-tile-covered');

        if (this.games.ownTiles.includes(this.tileId)) {
          this.renderer.addClass(this.gameTile?.nativeElement, 'game-tile-your-ship');
        }

        if (this.games.currentSelection===this.tileId) {
          this.renderer.addClass(this.gameTile?.nativeElement, 'game-tile-targeted');
        } else {
          this.renderer.removeClass(this.gameTile?.nativeElement, 'game-tile-targeted');
        }

        if (this.games.state.game_state?.hit_tile_ids?.includes(this.tileId)) {
          this.renderer.addClass(this.gameTile?.nativeElement, 'game-tile-struck-enemy-ship');
        } else {
          this.renderer.removeClass(this.gameTile?.nativeElement, 'game-tile-struck-enemy-ship');
        }

        if (this.games.state.game_state?.miss_tile_ids?.includes(this.tileId)) {
          this.renderer.addClass(this.gameTile?.nativeElement, 'game-tile-missed-enemy-ship');
        } else {
          this.renderer.removeClass(this.gameTile?.nativeElement, 'game-tile-missed-enemy-ship');
        }

        if (this.games.state.game_state?.my_hit_tile_ids?.includes(this.tileId)) {
          this.renderer.removeClass(this.gameTile?.nativeElement, 'game-tile-your-ship');
          this.renderer.addClass(this.gameTile?.nativeElement, 'game-tile-your-ship-sank');
        } else {
          this.renderer.removeClass(this.gameTile?.nativeElement, 'game-tile-your-ship-sank');
        }
      }
    } else setTimeout(()=>this._update_tile(), 500)
  }

  stopWatchingShips() {
    this._watchShips.set(false);
    // this.renderer.removeClass(this.gameTile?.nativeElement, 'game-tile-covered');
  }

  stopWatchingGameTile() {
    this._watchGameTile.set(false);
  }

  // internal logic
  @HostListener("window:resize", ["$event"])
  onResizeScreen() {
    if (this.ships.active) {
      this.ships.hideShips();
      this.ships.resetShipLocations();
      setTimeout(()=>this.ships.showShips(), 250);
    }
    this.detectTileLocationChange()
  }

  // detect mousedown events on game-tile
  @HostListener('mousedown') onClick() {
    // execute every click
    // console.log(`click detected ${this.tileId}`);
    this.games.updateTileSelection(this.tileId);
  }

  private detectTileLocationChange() {
    setTimeout(()=>{
      const gameTileLocation = this.gameTile?.nativeElement.getBoundingClientRect();
      const x = gameTileLocation.x;
      const y = gameTileLocation.y;
      this.ships.setTileLocations(this.tileId, {
        xStart: x,
        xEnd: x + gameTileLocation.width,
        yStart: y,
        yEnd: y + gameTileLocation.height,
      });
    }, 500)
  }

}
