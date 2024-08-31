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

  // services
  renderer = inject(Renderer2);

  // internal state
  @ViewChild("draggableComponent") draggableComponent!: GameShipDraggableComponent;
  @ViewChild("containingColumn") containingColumn!: ElementRef;

  // lifecycle
  ngAfterViewInit() {
    if (!(this.draggableComponent && this.containingColumn)) return;
    const width = window.getComputedStyle(this.draggableComponent.shipRef.nativeElement).width;
    const computedWidth = 10 + Number(width.substring(0, width.length - 2));
    this.renderer.setStyle(this.containingColumn.nativeElement, 'width', computedWidth + 'px');
  }
}
