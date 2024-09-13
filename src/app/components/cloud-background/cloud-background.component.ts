import {Component, Input} from "@angular/core";
import {NgOptimizedImage} from "@angular/common";

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
  @Input() displayMode: 'cloudy' | 'partly_cloudy' = 'partly_cloudy';
}
