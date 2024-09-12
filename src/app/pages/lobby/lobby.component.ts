import { Component } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { NgFor } from '@angular/common';  // Import NgFor


@Component({
  selector: "app-lobby",
  standalone: true,
  templateUrl: "./lobby.component.html",
  styleUrls: ["./lobby.component.scss"],
  imports: [ReactiveFormsModule, NgFor]  // Include NgFor in the imports array
})
export class LobbyComponent {
  _testData: any[] = [
    { player_id: "0001", player_name: "Player One" },
    { player_id: "0002", player_name: "Player Two" },
    { player_id: "0003", player_name: "Player Three" },
    { player_id: "0004", player_name: "Player Four" },
    { player_id: "0005", player_name: "Player Five" }
  ];


  _testRequestData: any[] = [
    { player_id: "0001", player_name: "Player One" },
    { player_id: "0002", player_name: "Player Two" },
    { player_id: "0003", player_name: "Player Three" },
    { player_id: "0004", player_name: "Player Four" },
    { player_id: "0005", player_name: "Player Five" }
  ];


  searchedPlayer = new FormControl('');


  trackPlayerId(index: number, player: any): string {
    return player.player_id;
  }


  onSubmit(): void {
    const query = this.searchedPlayer.value;
    if (query) {
      console.log(`Searching for player: ${query}`);
    } else {
      console.log('No player name or ID entered.');
    }
  }


  quickMatch(): void {
    console.log('Quick match initiated!');
  }
}
