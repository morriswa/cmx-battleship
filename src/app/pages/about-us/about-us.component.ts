import {Component} from "@angular/core";

@Component({
  selector: "app-play-game",
  templateUrl: "./about-us.component.html",
  styleUrl: "./about-us.component.scss",
  imports: [],
  standalone: true
})
export class AboutUsComponent {
  team = ["William", "Makenna", "Kevin", "Rahul", "Timothy"];
}
