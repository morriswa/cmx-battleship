import {Injectable, signal, WritableSignal} from "@angular/core";

@Injectable()
export class SessionService {
  private sessionId: WritableSignal<string|undefined>;

  get id() {
    return this.sessionId();
  };

  get active(): boolean {
    return !!this.sessionId();
  }

  constructor() {
    const cachedId = localStorage.getItem("session-service.sessionId");
    this.sessionId = signal(cachedId ?? undefined);
  }
  start(sessionId: string) {
    this.sessionId.set(sessionId);
    localStorage.setItem("session-service.sessionId", sessionId);
  }

  end() {
    this.sessionId.set(undefined);
    localStorage.removeItem("session-service.sessionId");
  }
}
