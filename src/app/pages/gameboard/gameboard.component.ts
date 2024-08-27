import {Component} from "@angular/core";

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  standalone: true,
  styleUrl: "./gameboard.component.scss"
})
export class GameboardComponent {
  rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  cols = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];


}
