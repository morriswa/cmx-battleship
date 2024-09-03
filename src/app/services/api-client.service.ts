import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {JoinLobby, NewUserSession, OnlineStats} from "../types/lobby.types";
import {GameBoard} from "../types/game.types";


export type SUPPORTED_METHODS = 'GET' | 'POST' | 'PUT' | 'DELETE';

@Injectable()
export class ApiClient {
  private endpoint = process.env['APP_API_ENDPOINT']
  private http = inject(HttpClient);

  // internal methods
  private request<T>(method: SUPPORTED_METHODS, url: string, body?: any, additionalHeaders?: HttpHeaders): Promise<T | undefined> {
    return firstValueFrom(this.http.request<T>(
      method,
      url,
      {
        observe: 'body',
        headers: additionalHeaders,
        body: body
      }
    ));
  }

  // public api
  getOnlineStats() {
    return this.request<OnlineStats>('GET', `${this.endpoint}/info`);
  }

  startUserSession(request: JoinLobby): Promise<NewUserSession | undefined> {
    return this.request<NewUserSession>('POST', `${this.endpoint}/login`, request);
  }

  endUserSession() {
    return this.request<void>('DELETE', `${this.endpoint}/logout`);
  }

  requestGame(player_id: string) {
    return this.request<void>('POST', `${this.endpoint}/game/requests`, {
      player_id: player_id,
    });
  }

  getGameRequests() {
    return this.request<any[]>('GET', `${this.endpoint}/game/requests`);
  }

  startGame(ships: GameBoard) {
    // return Promise.resolve();
    return this.request('POST', `${this.endpoint}/game/active/start`, ships);
  }

  getAvailablePlayers() {
    return this.request<any[]>('GET', `${this.endpoint}/games`);
  }

  createGameRequest(player_id: string) {
    return this.request<void>('POST', `${this.endpoint}/game/requests`, {'player_id': player_id});
  }

  joinGame(game_request_id: number) {
    return this.request<void>('POST', `${this.endpoint}/game/request/${game_request_id}`);
  }

  getGameState() {
    return this.request<any>('GET', `${this.endpoint}/game/active`);
  }

  forfeitGame() {
    return this.request<void>('DELETE', `${this.endpoint}/game/active`);
  }
}
