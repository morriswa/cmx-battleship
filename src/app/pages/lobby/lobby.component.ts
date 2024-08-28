import {Component} from "@angular/core";
import { FormControl, ReactiveFormsModule} from "@angular/forms";

@Component ({
    selector: "app-lobby",
    standalone: true,
    templateUrl: "./lobby.component.html",
    styleUrl: "./lobby.component.scss",
    imports: [ReactiveFormsModule]
})

export class LobbyComponent {

    _testData: any[] = [
        {player_id: "0001", player_name: "Player One"},
        {player_id: "0002", player_name: "Player Two"},
        {player_id: "0003", player_name: "Player Three"},
        {player_id: "0004", player_name: "Player Four"},
        {player_id: "0005", player_name: "Player Five"}
    ]

   searchedPlayer = new FormControl();

   async onSubmit() { 
        console.log("Submitted")
}
}