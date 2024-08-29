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
    this.dnd.setBlockedLocations(this.shipLength, this.shipRef.nativeElement.getBoundingClientRect());
  }

}
