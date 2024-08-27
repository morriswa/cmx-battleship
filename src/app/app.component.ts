import {Component} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {GameboardComponent} from "./pages/gameboard/gameboard.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  imports: [
    RouterOutlet,
    GameboardComponent
  ],
  standalone: true
})
export class AppComponent { }
