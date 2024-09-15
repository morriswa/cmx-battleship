import { Component, OnInit, WritableSignal, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LobbyService } from "src/app/services/lobby.service"; // Service to handle lobby-related tasks
import { sleep } from "src/app/utils"; // Utility function for sleeping/polling
import { Router } from "@angular/router"; // Router for navigation between pages
import { ActiveGameService } from "../../services/active-game.service"; // Service to manage active game sessions
import { CommonModule } from "@angular/common"; // Common Angular module for directives
import { CloudBackgroundComponent } from "../../components/cloud-background/cloud-background.component"; // Custom cloud background component

@Component({
  selector: "app-lobby",
  standalone: true,
  templateUrl: "./lobby.component.html", // HTML template for the lobby UI
  styleUrls: ["./lobby.component.scss"], // Styles for the lobby component
  imports: [ReactiveFormsModule, CommonModule, CloudBackgroundComponent] // Import necessary modules and components
})

export class LobbyComponent implements OnInit {
  // Injected services
  lobbyService = inject(LobbyService); // Inject the lobby service to access lobby functionalities
  gameService = inject(ActiveGameService); // Inject the game service to manage game sessions
  router = inject(Router); // Inject the router for navigation between different pages

  // Caches to store data for online players and game requests
  availablePlayerCache: WritableSignal<any[] | undefined> = signal(undefined); // Signal to hold the available players list
  gameRequestCache: WritableSignal<any[] | undefined> = signal(undefined); // Signal to hold incoming game requests

  // Form control for searching players by name or ID
  searchedPlayer = new FormControl(''); // Reactive form control for searching players

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    this.pollGameRequests(); // Start polling for game requests and available players
  }

  // Method to poll for game requests and available players
  async pollGameRequests() {
    while (true) {
      // Fetch the list of incoming game requests and store them in the cache
      const games = await this.lobbyService.getGameRequests();
      this.gameRequestCache.set(games);

      // Fetch the current game state and check if it's in the 'select' phase
      const gameState = await this.gameService.refreshGameSession();
      if (gameState?.game_phase === 'selct' as string) { // Navigate to the game page if the game phase is 'select'
        this.router.navigate(['/play']);
        return;
      }

      // Fetch the list of available players and store them in the cache
      this.lobbyService.getAvailablePlayers().then((players: any[] | undefined) => {
        this.availablePlayerCache.set(players); // Update available players cache
      });

      // Wait 5 seconds before polling again
      await sleep(5_000);
    }
  }

  // Method to request a match with another player
  handleCreateRequest(player_id: string) {
    console.log(`Requesting match with player ${player_id}`);
    this.lobbyService.createGameRequest(player_id) // Request a game with the player
      .then(() => {
        console.log(`Match request sent to player ${player_id}`); // Log success message
      })
      .catch(error => {
        console.error(`Failed to request match: ${error}`); // Log error message
      });
  }

  // Method to accept an incoming match request
  async handleJoinGame(game_request_id: number) {
    console.log(`Accepting match request ${game_request_id}`);
    try {
      // Join the game using the request ID and navigate to the game page
      await this.lobbyService.joinGame(game_request_id);
      this.router.navigate(['/play']);
      console.log(`Joined game ${game_request_id}`);
    } catch (error) {
      console.error(`Failed to join game: ${error}`); // Log error if joining fails
    }
  }

  // Method to log out from the lobby and navigate back to the home page
  async handleLogout() {
    await this.lobbyService.leaveLobby(); // Leave the lobby
    this.router.navigate(['/']); // Navigate to the home page
  }

  // Method to track players and requests by their unique player IDs for better rendering performance
  trackPlayerId(index: number, player: any): string {
    return player.player_id; // Use player ID as the unique identifier
  }
}
