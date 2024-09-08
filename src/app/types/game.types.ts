
export type GamePhase = 'new' | 'wait'| 'selct' | 'goodg' | 'p1win' | 'p2win' | 'nowin' | 'killd'

export type Player = 'p1' | 'p2'

export class GameBoard {
  ship_1?: string[];
  ship_2?: string[];
  ship_3?: string[];
  ship_4?: string[];
  ship_5?: string[];

  constructor(data: any) {
    this.ship_1 = data.ship_1;
    this.ship_2 = data.ship_2;
    this.ship_3 = data.ship_3;
    this.ship_4 = data.ship_4;
    this.ship_5 = data.ship_5;
  }
}

export type GameState = {
  hit_tile_ids: string[]
  miss_tile_ids: string[]
  ships_remaining?: number;
  my_hit_tile_ids: string[]
  my_miss_tile_ids: string[]
  my_ships_remaining: number
}

export type GameSession = {
  game_phase: GamePhase;
  active_turn: Player;
  player_one_or_two: Player;
  game_state?: GameState;
}
