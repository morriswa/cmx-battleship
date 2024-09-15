import {Component, Input} from "@angular/core";
import {NgOptimizedImage} from "@angular/common";

/**
 * This component is used to animate the cloud background on the https://www.morriswa.org/cmx/battleship/start webpage.
 * There are two different types of backgrounds. One is cloud which combines 4 images, and partly-cloud that combines 2 images.
 */
@Component({
  selector: "app-cloud-background",
  templateUrl: "./cloud-background.component.html",
  styleUrl: "./cloud-background.component.scss",
  imports: [
    NgOptimizedImage
  ],
  standalone: true
})
export class CloudBackgroundComponent {
  @Input() displayMode: 'cloudy' | 'partly_cloudy' = 'partly_cloudy'; // define the two display modes to be cloudy or partly cloudy - default display is partly_cloudy
}
