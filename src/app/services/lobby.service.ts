import {inject, Injectable, signal, WritableSignal} from "@angular/core";
import {ApiClient} from "./api-client.service";
import {JoinLobby, OnlineStats, UserSession} from "../types/lobby.types";
import {SessionAuthenticationService} from "./session-authentication.service";

@Injectable()
export class LobbyService {
  private session = inject(SessionAuthenticationService);
  private api = inject(ApiClient);

  sessionInfo: WritableSignal<UserSession | undefined> = signal(undefined);

  constructor() {
    const sessionInfoCache = localStorage.getItem("lobby-service.sessionInfo");
    if (sessionInfoCache) this.sessionInfo.set(JSON.parse(sessionInfoCache));
  }

  async gameStats(): Promise<OnlineStats> {
    const response = await this.api.getOnlineStats();
    if (!response) throw new Error('failed to fetch online game stats')
    else return response;
  }

  async joinLobby(request: JoinLobby): Promise<void>  {
    const session = await this.api.startUserSession(request);
    if (!session) throw new Error("failed to start session");
    this.session.start(session.session_id);
    this.sessionInfo.set({
      player_id: session.player_id,
      player_name: request.player_name,
      session_id: session.session_id,
      num_ships: request.num_ships,
    });
    localStorage.setItem("lobby-service.sessionInfo", JSON.stringify(this.sessionInfo()));
  }

  async leaveLobby() {
    const sessionInfo = this.sessionInfo();
    if (!sessionInfo) return;
    await this.api.endUserSession();
    localStorage.removeItem("lobby-service.sessionInfo");
    this.session.end();
  }

  async getAvailablePlayers() {
    return this.api.getAvailablePlayers()
  }

  async getGameRequests() {
    return this.api.getGameRequests()
  }

  createGameRequest(player_id: string) {
    return this.api.createGameRequest(player_id)
  }

  async joinGame(game_request_id: number) {
    return this.api.joinGame(game_request_id)
  }
}
