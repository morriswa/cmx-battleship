
export type JoinLobby = {
  player_name: string;
  num_ships: string;
}

export type NewUserSession = {
  session_id: string;
  player_id: string;
}

export type UserSession = {
  session_id: string;
  player_id: string;
  player_name: string;
  num_ships: string;
}

export type OnlineStats = {
  playerCount: number;
}

export type AvailablePlayer = {
  player_id: string;
  player_name: string;
}

export type GameRequest = {
  game_request_id: string;
  player_id: string;
  player_name: string;
}
