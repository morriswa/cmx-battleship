import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {SessionAuthenticationService} from "../services/session-authentication.service";

export const UserSessionGuard: CanActivateFn = () => {

    const lobby = inject(SessionAuthenticationService);
    const router = inject(Router);

    if (!lobby.active) {
        router.navigate(['/'])
        return false;
    }

    return true;
}
