import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnInit,
  ViewChild
} from "@angular/core";
import {GameDragAndDropService} from "../../injectables/game-drag-and-drop.service";

@Component({
  selector: 'app-game-tile',
  templateUrl: './game-tile.component.html',
  standalone: true,
  imports: [],
  styleUrl: "./game-tile.component.scss"
})
export class GameTileComponent implements OnInit, AfterViewChecked {

  dnd = inject(GameDragAndDropService);

  @Input() tileId!: string;

  @ViewChild("gameTile") gameTile!: ElementRef;

  gameTileLocX?: number;
  gameTileLocY?: number;

  getGameTileLocation() {
    const gameTileLocation = this.gameTile.nativeElement.getBoundingClientRect();
    this.gameTileLocX = gameTileLocation.x;
    this.gameTileLocY = gameTileLocation.y;
  }

  @HostListener("window:resize", ["$event"])
  onResizeScreen() {
    this.getGameTileLocation();
  }

  ngOnInit(): void {
    this.dnd.locationUpdated.subscribe(()=>{
      this.shipMoved()
    });
  }


  ngAfterViewChecked(): void {
    this.getGameTileLocation();
  }


  private shipMoved() {
    const shipLocations = this.dnd.blockedLocations.values();
  }

  // detect mousedown events on game-tile
  @HostListener('mousedown') onClick() {
    // execute every click
    console.log(`click detected ${this.tileId}`);
  }

}
