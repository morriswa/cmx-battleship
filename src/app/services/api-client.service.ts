import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http"; // HttpClient and HttpHeaders for HTTP requests
import { firstValueFrom } from "rxjs"; // Used to convert observables to promises
import { AvailablePlayer, GameRequest, JoinLobby, NewUserSession, OnlineStats } from "../types/lobby.types"; // Type definitions for lobby-related data
import { GameBoard, GameSession } from "../types/game.types"; // Type definitions for game-related data
import { environment } from "../../environments/environment"; // Import environment variables

// Define the supported HTTP methods
export type SUPPORTED_METHODS = 'GET' | 'POST' | 'PUT' | 'DELETE';

@Injectable() // Mark this class as an injectable service
export class ApiClient {
  // The base API endpoint (from environment variables)
  private endpoint = environment.APP_API_ENDPOINT;

  // Inject the HttpClient service to make HTTP requests
  private http = inject(HttpClient);

  /**
   * Private helper method to send HTTP requests.
   * @param method The HTTP method (GET, POST, PUT, DELETE)
   * @param url The API endpoint to hit
   * @param body Optional request body (for POST/PUT requests)
   * @param additionalHeaders Optional additional HTTP headers
   * @returns A promise that resolves with the response body or undefined
   */
  private request<T>(method: SUPPORTED_METHODS, url: string, body?: any, additionalHeaders?: HttpHeaders): Promise<T | undefined> {
    return firstValueFrom(this.http.request<T>(
      method, // The HTTP method
      url, // The API endpoint
      {
        observe: 'body', // Observe the response body
        headers: additionalHeaders, // Any additional headers to send
        body: body // The body of the request (for POST/PUT)
      }
    ));
  }

  /**
   * Public API method to get the online statistics for the game.
   * @returns A promise that resolves with the online stats
   */
  getOnlineStats() {
    return this.request<OnlineStats>('GET', `${this.endpoint}/info`);
  }

  /**
   * Public API method to start a new user session (log in).
   * @param request The lobby join request containing player info
   * @returns A promise that resolves with the new user session details
   */
  startUserSession(request: JoinLobby): Promise<NewUserSession | undefined> {
    return this.request<NewUserSession>('POST', `${this.endpoint}/login`, request);
  }

  /**
   * Public API method to end the user's session (log out).
   * @returns A promise that resolves when the session is ended
   */
  endUserSession() {
    return this.request<void>('DELETE', `${this.endpoint}/logout`);
  }

  /**
   * Public API method to get game requests (matches) available to the user.
   * @returns A promise that resolves with an array of game requests
   */
  getGameRequests() {
    return this.request<GameRequest[]>('GET', `${this.endpoint}/game/requests`);
  }

  /**
   * Public API method to start a new game with the selected ships.
   * @param ships The game board configuration with selected ships
   * @returns A promise that resolves when the game starts
   */
  startGame(ships: GameBoard) {
    return this.request<void>('POST', `${this.endpoint}/game/active/start`, ships);
  }

  /**
   * Public API method to get the list of available players to challenge.
   * @returns A promise that resolves with an array of available players
   */
  getAvailablePlayers() {
    return this.request<AvailablePlayer[]>('GET', `${this.endpoint}/games`);
  }

  /**
   * Public API method to create a game request (challenge another player).
   * @param player_id The ID of the player to challenge
   * @returns A promise that resolves when the game request is created
   */
  createGameRequest(player_id: string) {
    return this.request<void>('POST', `${this.endpoint}/game/requests`, { 'player_id': player_id });
  }

  /**
   * Public API method to join a game request (accept a challenge).
   * @param game_request_id The ID of the game request to join
   * @returns A promise that resolves when the user joins the game
   */
  joinGame(game_request_id: number) {
    return this.request<void>('POST', `${this.endpoint}/game/request/${game_request_id}`);
  }

  /**
   * Public API method to get the current game session.
   * @returns A promise that resolves with the current game session
   */
  getGameSession() {
    return this.request<GameSession>('GET', `${this.endpoint}/game/active`);
  }

  /**
   * Public API method to forfeit the current game.
   * @returns A promise that resolves when the game is forfeited
   */
  forfeitGame() {
    return this.request<void>('DELETE', `${this.endpoint}/game/active`);
  }

  /**
   * Public API method to make a move (attack a tile) during the game.
   * @param currentTileSelection The ID of the tile to attack
   * @returns A promise that resolves when the move is made
   */
  makeMove(currentTileSelection: string) {
    return this.request<void>('POST', `${this.endpoint}/game/active`, { 'tile_id': currentTileSelection });
  }

  /**
   * Public API method to confirm if the user's session is still valid.
   * @returns A promise that resolves with true if the session is valid, false otherwise
   */
  async confirmValidSession(): Promise<boolean> {
    return this.request<void>('GET', `${this.endpoint}/shealth`)
      .then(() => true) // If the request is successful, return true (session is valid)
      .catch(() => false); // If the request fails, return false (session is invalid)
  }
}
