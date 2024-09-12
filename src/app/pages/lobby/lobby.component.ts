import { Component, OnInit, WritableSignal, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LobbyService } from "src/app/services/lobby.service";
import { sleep } from "src/app/utils";
import { Router } from "@angular/router";
import { ActiveGameService } from "../../services/active-game.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-lobby",
  standalone: true,
  templateUrl: "./lobby.component.html",
  styleUrls: ["./lobby.component.scss"],
  imports: [ReactiveFormsModule, CommonModule]
})

export class LobbyComponent implements OnInit {
  // Inject services
  lobbyService = inject(LobbyService); // Create variable, inject is used to access methods in lobby.service.ts
  gameService = inject(ActiveGameService);
  router = inject(Router);

  // Caches for players and game requests
  availablePlayerCache: WritableSignal<any[] | undefined> = signal(undefined);
  gameRequestCache: WritableSignal<any[] | undefined> = signal(undefined);

  // Form control for the search input
  searchedPlayer = new FormControl('');

  ngOnInit(): void {
    this.pollGameRequests();
  }

  // Polling for game requests and available players
  async pollGameRequests() {
    while (true) {
      const games = await this.lobbyService.getGameRequests();
      this.gameRequestCache.set(games);

      const gameState = await this.gameService.refreshGameSession();
      if (gameState?.game_phase === 'selct' as string) {
        this.router.navigate(['/play']);
        return;
      }

      this.lobbyService.getAvailablePlayers().then((players: any[] | undefined) => {
        this.availablePlayerCache.set(players);
      });

      await sleep(5_000); // Poll every 5 seconds
    }
  }

  // Logic to request a match with another player
  handleCreateRequest(player_id: string) {
    console.log(`Requesting match with player ${player_id}`);
    this.lobbyService.createGameRequest(player_id).then(() => {
      console.log(`Match request sent to player ${player_id}`);
    }).catch(error => {
      console.error(`Failed to request match: ${error}`);
    });
  }

  // Logic to accept a match request
  async handleJoinGame(game_request_id: number) {
    console.log(`Accepting match request ${game_request_id}`);
    try {
      await this.lobbyService.joinGame(game_request_id);
      this.router.navigate(['/play']);
      console.log(`Joined game ${game_request_id}`);
    } catch (error) {
      console.error(`Failed to join game: ${error}`);
    }
  }

  // Logic for logging out
  async handleLogout() {
    await this.lobbyService.leaveLobby();
    this.router.navigate(['/']);
  }

  // Method to track players and requests by their IDs for efficient rendering
  trackPlayerId(index: number, player: any): string {
    return player.player_id;
  }
}
