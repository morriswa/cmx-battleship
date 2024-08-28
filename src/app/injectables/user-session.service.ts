import {inject, Injectable, signal, WritableSignal} from "@angular/core";
import {ApiClient} from "./api-client.service";
import {StartUserSession, UserSession} from "../types/user-session.type";

@Injectable()
export class UserSessionService {
  private api = inject(ApiClient);

  sessionInfo: WritableSignal<UserSession | undefined> = signal(undefined);

  async startSession(request: StartUserSession): Promise<void>  {
    const session = await this.api.startUserSession(request);
    if (!session) throw new Error("failed to start session");
    this.sessionInfo.set({
      player_id: session.player_id,
      player_name: request.player_name,
      session_id: session.session_id,
      num_ships: request.num_ships,
    });
  }
}
