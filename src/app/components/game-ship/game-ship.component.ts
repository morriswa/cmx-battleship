import {Component, ElementRef, inject, Input, ViewChild} from "@angular/core";
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
export class GameShipComponent {
  @Input() shipLength!: number;

  @ViewChild("shipRef") shipRef!: ElementRef;

  dnd = inject(GameDragAndDropService);

  handleDropEnd() {

    const domRect = this.shipRef.nativeElement.getBoundingClientRect();

    this.dnd.setBlockedLocations(this.shipLength, {
      xStart: domRect.x,
      xEnd: domRect.x + domRect.width,
      yStart: domRect.y,
      yEnd: domRect.y + domRect.height
    });
  }

}
