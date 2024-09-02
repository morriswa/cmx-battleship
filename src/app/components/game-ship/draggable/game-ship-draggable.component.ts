import {
  Component,
  ElementRef,
  inject,
  Input,
  Renderer2,
  signal,
  ViewChild
} from "@angular/core";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {ShipDragAndDropService} from "../../../services/ship-drag-and-drop.service";
import {NgClass} from "@angular/common";

/**
 * provides a draggable 'ship' instance that reports its location to Ship Drag And Drop Service
 * enables tile tracking functionality
 */
@Component({
  selector: "app-game-ship-draggable",
  templateUrl: "./game-ship-draggable.component.html",
  styleUrl: "./game-ship-draggable.component.scss",
  imports: [
    CdkDrag,
    NgClass
  ],
  standalone: true
})
export class GameShipDraggableComponent {


  // io
  @Input() shipLength!: number;


  // services
  private ships = inject(ShipDragAndDropService);
  private renderer = inject(Renderer2);


  // internal state
  @ViewChild("shipRef") shipRef!: ElementRef;

  protected isHorizontal = signal(false);
  protected rotate() {
    this.isHorizontal.update(bo=>!bo);
    setTimeout(()=>this.handleDropEnd(), 50)
  }


  // internal state
  /**
   * called every time ship is moved
   * @protected
   */
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
