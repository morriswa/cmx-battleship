import {provideRouter} from "@angular/router";
import {routes} from "./routes";
import {ApplicationConfig, inject} from "@angular/core";
import {ApiClient} from "./injectables/api-client.service";
import {LobbyService} from "./injectables/lobby.service";
import {HttpInterceptorFn, provideHttpClient, withInterceptors} from "@angular/common/http";
import {ShipDragAndDropService} from "./injectables/ship-drag-and-drop.service";
import {ActiveGameService} from "./injectables/active-game.service";
import {SessionService} from "./injectables/session.service";

const SessionHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionService);

  if (session.active&&session.id) {
    console.log('adding headers', session.id);
    req = req.clone({
      headers: req.headers.set('session-id', session.id)
    });
  }

  return next(req);
};

export const AppConfig: ApplicationConfig = {
  providers: [
    // declare global services here
    SessionService,
    ApiClient,
    LobbyService,
    ShipDragAndDropService,
    ActiveGameService,
    // as well as required ng providers
    provideRouter(routes),
    provideHttpClient(withInterceptors([SessionHeaderInterceptor])),
  ]
};
