import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  numberAttribute,
  Renderer2,
  ViewChild
} from "@angular/core";
import {GameShipDraggableComponent} from "./draggable/game-ship-draggable.component";
import {GameShipSpacerComponent} from "./spacer/game-ship-spacer.component";

/**
 * Prints a ship on the screen, and keeps track of its original location
 */
@Component({
  selector: "app-game-ship",
  template: `
    <div class="flex-row align-items-flex-start" #containingColumn>
      <app-game-ship-spacer [shipLength]="this.shipLength"/>
      <app-game-ship-draggable #draggableComponent [shipLength]="this.shipLength"/>
    </div>
  `,
  imports: [
    GameShipDraggableComponent,
    GameShipSpacerComponent,
  ],
  standalone: true
})
export class GameShipComponent implements AfterViewInit {

  // io
  @Input({transform: numberAttribute}) shipLength!: number;
  // @Input() enabled = false;

  // services
  renderer = inject(Renderer2);

  // internal state
  @ViewChild("draggableComponent") draggableComponent!: GameShipDraggableComponent;
  @ViewChild("containingColumn") containingColumn!: ElementRef;

  // lifecycle
  ngAfterViewInit() {
    if (!(this.draggableComponent && this.containingColumn)) throw new Error('could not get refs for ship and container');
    // retrieves css property representing ship's width after being painted
    const width = window.getComputedStyle(this.draggableComponent.shipRef.nativeElement).width;
    // adds 10 px
    const computedWidth = `${10 + Number(width.substring(0, width.length - 2))}px`;
    // ensure container matches ship width, should not change after this set
    this.renderer.setStyle(this.containingColumn.nativeElement, 'width', computedWidth);
  }
}
