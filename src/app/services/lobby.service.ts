import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import { ApiClient } from "./api-client.service"; // Service for API interactions
import { AvailablePlayer, GameRequest, JoinLobby, OnlineStats, UserSession } from "../types/lobby.types"; // Type definitions for lobby-related data
import { SessionAuthenticationService } from "./session-authentication.service"; // Service for session management

@Injectable() // Marks this service as injectable in the Angular dependency injection system
export class LobbyService {
  // Injecting necessary services
  private session = inject(SessionAuthenticationService); // Inject session management service
  private api = inject(ApiClient); // Inject API client service

  // Writable signal to store the user's session information
  sessionInfo: WritableSignal<UserSession | undefined> = signal(undefined);

  // Constructor is responsible for restoring the session from localStorage (if available)
  constructor() {
    const sessionInfoCache = localStorage.getItem("lobby-service.sessionInfo"); // Check if session info is stored in localStorage
    if (sessionInfoCache) {
      // Validate the stored session info by confirming the session is still valid
      this.api.confirmValidSession()
        .then((valid) => {
          if (valid) {
            // If the session is valid, restore the session info from localStorage
            this.sessionInfo.set(JSON.parse(sessionInfoCache));
          } else {
            // If the session is not valid, end the session and clear localStorage
            this.session.end();
            localStorage.removeItem("lobby-service.sessionInfo");
          }
        });
    }
  }

  /**
   * Fetch online game statistics (e.g., player count).
   * @returns A promise that resolves with online stats
   */
  async gameStats(): Promise<OnlineStats> {
    const response = await this.api.getOnlineStats(); // Call the API to get online statistics
    if (!response) throw new Error('failed to fetch online game stats'); // Handle errors if the request fails
    else return response; // Return the online statistics
  }

  /**
   * Join the lobby by starting a new session.
   * @param request The request containing player info (name, number of ships)
   * @returns A promise that resolves when the session is started
   */
  async joinLobby(request: JoinLobby): Promise<void> {
    const session = await this.api.startUserSession(request); // Start a new user session via the API
    if (!session) throw new Error("failed to start session"); // Handle error if session couldn't be started
    this.session.start(session.session_id); // Start the session in the session service
    this.sessionInfo.set({
      player_id: session.player_id,
      player_name: request.player_name,
      session_id: session.session_id,
      num_ships: request.num_ships, // Store the number of ships the player selected
    });
    // Store session info in localStorage to persist it
    localStorage.setItem("lobby-service.sessionInfo", JSON.stringify(this.sessionInfo()));
  }

  /**
   * Leave the lobby and end the user session.
   * @returns A promise that resolves when the session is ended
   */
  async leaveLobby() {
    try {
      // If the session is active, call the API to end the session
      if (this.session.active) await this.api.endUserSession();
    } finally {
      // Clear the session information from localStorage and end the session
      localStorage.removeItem("lobby-service.sessionInfo");
      this.session.end();
    }
  }

  /**
   * Get the list of available players that the user can challenge.
   * @returns A promise that resolves with a list of available players
   */
  async getAvailablePlayers(): Promise<AvailablePlayer[] | undefined> {
    return this.api.getAvailablePlayers(); // Call the API to get available players
  }

  /**
   * Get the list of current game requests (matches) available to the user.
   * @returns A promise that resolves with a list of game requests
   */
  async getGameRequests(): Promise<GameRequest[] | undefined> {
    return this.api.getGameRequests(); // Call the API to get game requests
  }

  /**
   * Create a game request to challenge another player.
   * @param player_id The ID of the player to challenge
   * @returns A promise that resolves when the game request is created
   */
  createGameRequest(player_id: string): Promise<void> {
    return this.api.createGameRequest(player_id); // Call the API to create a new game request
  }

  /**
   * Join a game by accepting a game request.
   * @param game_request_id The ID of the game request to join
   * @returns A promise that resolves when the user joins the game
   */
  async joinGame(game_request_id: number): Promise<void> {
    return this.api.joinGame(game_request_id); // Call the API to join a game request
  }

  /**
   * Check if the user is currently logged in (session is valid).
   * @returns A promise that resolves with true if the user is logged in, false otherwise
   */
  async isLoggedIn(): Promise<boolean> {
    return this.api.confirmValidSession(); // Call the API to confirm if the session is valid
  }
}
