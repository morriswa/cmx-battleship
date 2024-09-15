//The GamePhase displays the state of the game and conclusion once game ends.
export type GamePhase = 'new' | 'wait'| 'selct' | 'goodg' | 'p1win' | 'p2win' | 'nowin' | 'killd'

//Displays player
export type Player = 'p1' | 'p2'

//Depending on the number of ships, once placed, it occupies those tiles.
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

//Displayed while playing how many ships remaining, if a ship at that tile has been hit or not, ect.
export type GameState = {
  hit_tile_ids: string[]
  miss_tile_ids: string[]
  ships_remaining?: number;
  my_hit_tile_ids: string[]
  my_miss_tile_ids: string[]
  my_ships_remaining: number
}

//GameSession type displays the state of the game from one of the options of GamePhase and whose turn it is.
export type GameSession = {
  game_phase: GamePhase;
  active_turn: Player;
  player_one_or_two: Player;
  game_state?: GameState;
}
