import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {LobbyService} from "../services/lobby.service";

export const UserSessionGuard: CanActivateFn = async () => {

  const lobby = inject(LobbyService);
  const router = inject(Router);

  const isLoggedIn = await lobby.isLoggedIn();
  if (isLoggedIn) {
    await lobby.getAvailablePlayers();
    return true;
  } else {
    await lobby.leaveLobby();
    await router.navigate(['/'])
    return false;
  }
}
