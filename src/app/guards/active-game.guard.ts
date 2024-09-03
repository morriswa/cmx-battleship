import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {ActiveGameService} from "../services/active-game.service";

export const ActiveGameGuard: CanActivateFn = async () => {

    const gameService = inject(ActiveGameService);
    const router = inject(Router);

    const gameState = await gameService.getGameState();
    if (!gameState) {
        router.navigate(['/lobby'])
        return false;
    }

    return true;
}

