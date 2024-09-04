import {inject, Injectable, signal, WritableSignal} from "@angular/core";
import {ApiClient} from "./api-client.service";
import {GameBoard, GamePhase, GameSession} from "../types/game.types";
import {BehaviorSubject} from "rxjs";


@Injectable()
export class ActiveGameService {


  // declare
  ACTIVE_PHASES = ['new', 'wait', 'selct', 'goodg']


  // services
  private api = inject(ApiClient);


  // state
  event = new BehaviorSubject<{ type: string }>({ type: 'init' });


  // store user's ship
  private _gameSession: WritableSignal<GameSession | undefined> = signal(undefined);
  private _currentTileSelection: WritableSignal<string|undefined> = signal(undefined);

  get currentSelection(): string | undefined {
    return this._currentTileSelection()
  };

  get session(): GameSession | undefined {
    return this._gameSession();
  }

  async refreshGameSession(): Promise<GameSession | undefined> {
    const response = await this.api.getGameSession();
    this._gameSession.set(response);
    return response;
  }

  get loading(): boolean {
    const state = this._gameSession()
    return !state;
  }

  get phase(): GamePhase | undefined {
    const state = this._gameSession()
    if (!state) return undefined;
    return state.game_phase
  }

  get doneWithSelection(): boolean {
    const state = this._gameSession();
    return !!(state?.game_state?.my_miss_tile_ids);
  };

  get active(): boolean {
    const phase = this.phase ?? 'wait';
    return this.ACTIVE_PHASES.includes(phase);
  };

  get activeTurn() {
    const state = this._gameSession()
    if (!state) return false;
    return this._gameSession()!.player_one_or_two === this._gameSession()!.active_turn;
  }

  async startGame(ships: GameBoard) {
    await this.api.startGame(ships);
    const game_state = await this.api.getGameSession();
    console.log('activating game service')
    this._gameSession.set(game_state);
  }

  resetActiveGameService() {
    console.log('killing game service')
    this._gameSession.set(undefined);
  }

  forfeitGame() {
    return this.api.forfeitGame()
  }

  updateTileSelection(tileId: string | undefined) {
    this._currentTileSelection.set(tileId);
    this.event.next({type: 'updateState'})
  }

  async commitMove() {
    const currentTile = this._currentTileSelection();
    if (!currentTile) throw new Error('need to select a tile to attack')

    await this.api.makeMove(currentTile);
    const response = await this.api.getGameSession();
    this._gameSession.set(response);
    this._currentTileSelection.set(undefined);
    // call to reload tile styles
    this.event.next({type: 'updateState'})
    return response
  }
}
