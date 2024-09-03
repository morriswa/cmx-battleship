import {inject, Injectable, signal, WritableSignal} from "@angular/core";
import {ApiClient} from "./api-client.service";
import {GameBoard} from "../types/game.types";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class ActiveGameService {


  // services
  private api = inject(ApiClient);


  // state
  event = new BehaviorSubject<{ type: string }>({ type: 'init' });


  // store user's ship
  private _userShips: WritableSignal<GameBoard | undefined> = signal(undefined);
  private _currentPlayerGameState: WritableSignal<any | undefined> = signal(undefined);
  private _waiting = signal(false);
  private _currentTileSelection: WritableSignal<string|undefined> = signal(undefined);

  get currentSelection(): string | undefined{
    return this._currentTileSelection()
  };

  get state(): any {
    return this._currentPlayerGameState();
  }

  get phase(): string | undefined {
    const state = this._currentPlayerGameState()
    if (!state) return undefined;
    return state.game_phase
  }

  get doneWithSelection(): boolean {
    const state = this._currentPlayerGameState()
    if (!state) return false;
    else if (state.game_state?.board) {
      return true;
    }
    else return state.game_phase!=='selct'
  };

  get active(): boolean {
    return !!this._currentPlayerGameState();
  };

  get waiting() {
    return this._waiting();
  }

  get shipsRemaining(): number {
    return this._userShips()!.keys().length ?? 0
  }

  get activeTurn() {
    const state = this._currentPlayerGameState()
    if (!state) return false;
    return this._currentPlayerGameState().player_one_or_two === this._currentPlayerGameState().active_turn;
  }

  get ownTiles(): string[] {
    let allTiles = [];
    const ships = this._userShips()
    if (!ships) return []
    else{
      for (const tiles of ships.values())
        for (const tile of tiles ?? []) allTiles.push(tile);
      return allTiles;
    }
  }

  async startGame(ships: GameBoard) {
    await this.api.startGame(ships);
    console.log('activating game service')
    this._userShips.set(ships);
  }

  resetActiveGameService() {
    console.log('killing game service')
    this._userShips.set(undefined);
  }

  getGameState() {
    return this.api.getGameState()
  }

  forfeitGame() {
    return this.api.forfeitGame()
  }

  setGameState(state: any) {
    this._currentPlayerGameState.set(state);
    if (state.game_state) {
      this._userShips.set(new GameBoard(state.game_state.board));
      this.event.next({type: 'updateState'})
    }
  }

  updateTileSelection(tileId: string) {
    this._currentTileSelection.set(tileId);
    this.event.next({type: 'updateState'})
  }

  commitMove() {
    this.api.makeMove(this._currentTileSelection()!)
  }
}
