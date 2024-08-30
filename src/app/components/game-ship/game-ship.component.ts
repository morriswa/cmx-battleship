import {
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  Renderer2,
  signal,
  ViewChild
} from "@angular/core";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {ShipDragAndDropService} from "../../injectables/ship-drag-and-drop.service";
import {NgClass} from "@angular/common";

@Component({
  selector: "app-game-ship",
  templateUrl: "./game-ship.component.html",
  styleUrl: "./game-ship.component.scss",
  imports: [
    CdkDrag,
    NgClass
  ],
  standalone: true
})
export class GameShipComponent implements OnInit {

  // io
  @Input() shipLength!: number;

  // services
  private ships = inject(ShipDragAndDropService);
  private renderer = inject(Renderer2);

  // internal state
  @ViewChild("shipRef") shipRef!: ElementRef;
  protected display = signal(true);
  protected isHorizontal = signal(true);
  protected rotate() {
    this.isHorizontal.update(bo=>!bo);
    setTimeout(()=>this.handleDropEnd(), 100)
  }


  // lifecycle
  ngOnInit() {
    this.ships.placementComplete?.subscribe(()=>{
      this.display.set(false);
    })
  }

  // internal state
  protected handleDropEnd() {

    this.ships.removeShip(this.shipLength)

    const domRect = this.shipRef.nativeElement.getBoundingClientRect();

    let coveredIds = this.ships.updateShipLocation(this.shipLength, {
      xStart: domRect.x,
      xEnd: domRect.x + domRect.width,
      yStart: domRect.y,
      yEnd: domRect.y + domRect.height
    });

    this.ships.setShipStatus(this.shipLength, coveredIds, this.handleDropEnd);

    if (this.ships.duplicatePlacement) {
      this.renderer.addClass(this.shipRef.nativeElement, 'game-ship-error')
      this.ships.raiseError('Ships cannot go on top of each other');
    }
    else if (coveredIds.length === this.shipLength) {
      this.renderer.removeClass(this.shipRef.nativeElement, 'game-ship-error')
      this.ships.resetError();
    }
    else {
      this.ships.removeShip(this.shipLength);
      this.renderer.addClass(this.shipRef.nativeElement, 'game-ship-error')
      this.ships.raiseError(`Ship 1x${this.shipLength} should cover ${this.shipLength} tiles. `);
    }
  }

}
