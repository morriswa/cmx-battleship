
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
