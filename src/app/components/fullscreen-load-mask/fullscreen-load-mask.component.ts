import {Component} from "@angular/core";
import {CloudBackgroundComponent} from "../cloud-background/cloud-background.component";

@Component({
  selector: "app-fullscreen-load-mask",
  templateUrl: "./fullscreen-load-mask.component.html",
  styleUrl: "./fullscreen-load-mask.component.scss",
  imports: [
    CloudBackgroundComponent
  ],
  standalone: true
})
export class FullscreenLoadMaskComponent {

}
