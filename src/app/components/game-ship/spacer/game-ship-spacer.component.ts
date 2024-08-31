import {Component, Input} from "@angular/core";

@Component({
  selector: "app-game-ship-spacer",
  template: `
    <!-- build dock -->
    <div class="flex-col">
      @for (shipSection of ['1','2','3','4','5'].slice(0, this.shipLength); track shipSection;) {
        <div class="game-ship-initial-location-placeholder"></div>
      }
    </div>
  `,
  standalone: true
})
export class GameShipSpacerComponent {

  // io
  @Input() shipLength!: number;
}
