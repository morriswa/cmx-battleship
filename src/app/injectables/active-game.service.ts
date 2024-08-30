import {EventEmitter, inject, Injectable, signal, WritableSignal} from "@angular/core";
import {ApiClient} from "./api-client.service";

@Injectable()
export class ActiveGameService {


  // services
  private api = inject(ApiClient);


  // state
  event = new EventEmitter<{type: string}>();


  // store user's ship
  private _userShips: WritableSignal<Map<number, string[]> | undefined> = signal(undefined);
  private _waiting = signal(false);

  get active(): boolean {
    return !!this._userShips();
  };

  get waiting() {
    return this._waiting();
  }

  get shipsRemaining(): number {
    return Array.from(this._userShips()!.keys()).length ?? 0
  }

  get ownTiles(): string[] {
    let allTiles = [];
    for (const tiles of this._userShips()?.values() ?? [])
      for (const tile of tiles) allTiles.push(tile);
    return allTiles;
  }

  async markBoardWithShips(ships: Map<number, string[]>) {
    await this.api.startGame(ships);
    console.log('activating game service')
    this._userShips.set(ships);
    this._waiting.set(true);
  }

  resetActiveGameService() {
    console.log('killing game service')
    this._userShips.set(undefined);
  }
}
