import {Component, Input} from "@angular/core";

/**
 * provides a blank div with the same dimensions as the ship click-box
 * maintains reference to ship's original location making reset-location functionality possible
 */
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
