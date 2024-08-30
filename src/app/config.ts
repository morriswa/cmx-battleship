import {provideRouter} from "@angular/router";
import {routes} from "./routes";
import {ApplicationConfig} from "@angular/core";
import {ApiClient} from "./injectables/api-client.service";
import {UserSessionService} from "./injectables/user-session.service";
import {provideHttpClient} from "@angular/common/http";
import {ShipDragAndDropService} from "./injectables/ship-drag-and-drop.service";



export const AppConfig: ApplicationConfig = {
  providers: [
    // declare global services here
    ApiClient,
    UserSessionService,
    ShipDragAndDropService,
    // as well as required ng providers
    provideRouter(routes),
    provideHttpClient(),
  ]
}
