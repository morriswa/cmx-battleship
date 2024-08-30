import {Component, ElementRef, inject, Input, OnInit, Renderer2, ViewChild} from "@angular/core";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {GameDragAndDropService} from "../../injectables/game-drag-and-drop.service";

@Component({
  selector: "app-game-ship",
  templateUrl: "./game-ship.component.html",
  styleUrl: "./game-ship.component.scss",
  imports: [
    CdkDrag
  ],
  standalone: true
})
export class GameShipComponent implements OnInit{
  @Input() shipLength!: number;

  @ViewChild("shipRef") shipRef!: ElementRef;

  _render = inject(Renderer2);
  dnd = inject(GameDragAndDropService);

  enabled = true;

  ngOnInit() {
    this.dnd.resetSignal?.subscribe(()=>{
      console.log('got sig')
      this.enabled = false;
    })
  }

  handleDropEnd() {

    this.dnd.removeShip(this.shipLength)

    const domRect = this.shipRef.nativeElement.getBoundingClientRect();

    let coveredIds = this.dnd.setBlockedLocations(this.shipLength, {
      xStart: domRect.x,
      xEnd: domRect.x + domRect.width,
      yStart: domRect.y,
      yEnd: domRect.y + domRect.height
    });

    this.dnd.setShipStatus(this.shipLength, coveredIds, this.handleDropEnd);

    if (this.dnd.duplicateScan()) {
      this._render.addClass(this.shipRef.nativeElement, 'game-ship-error')
      this.dnd.raiseError('Ships cannot go on top of each other');
    }
    else if (coveredIds.length === this.shipLength) {
      this._render.removeClass(this.shipRef.nativeElement, 'game-ship-error')
      this.dnd.resetError();
    }
    else {
      this.dnd.removeShip(this.shipLength);
      this._render.addClass(this.shipRef.nativeElement, 'game-ship-error')
      this.dnd.raiseError(`Ship 1x${this.shipLength} should cover ${this.shipLength} tiles. `);
    }

  }

}
