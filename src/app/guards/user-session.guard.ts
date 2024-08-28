import {CanActivateFn, Router} from "@angular/router";
import {UserSessionService} from "../injectables/user-session.service";
import {inject} from "@angular/core";

export const UserSessionGuard: CanActivateFn = () => {

    const uss = inject(UserSessionService);
    const router = inject(Router);

    const canAccess = !!uss.sessionInfo();
    if (!canAccess) {
        router.navigate(['/'])
        return false;
    }

    return true;
}
