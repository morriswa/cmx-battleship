import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {SessionService} from "../injectables/session.service";

export const UserSessionGuard: CanActivateFn = () => {

    const lobby = inject(SessionService);
    const router = inject(Router);

    if (!lobby.active) {
        router.navigate(['/'])
        return false;
    }

    return true;
}
