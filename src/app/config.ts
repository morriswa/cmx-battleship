import {provideRouter} from "@angular/router";
import {routes} from "./routes";
import {ApplicationConfig} from "@angular/core";
import {ApiClient} from "./injectables/api-client.service";
import {UserSessionService} from "./injectables/user-session.service";
import {provideHttpClient} from "@angular/common/http";



export const AppConfig: ApplicationConfig = {
  providers: [
    // declare global services here
    ApiClient,
    UserSessionService,
    // as well as required ng providers
    provideRouter(routes),
    provideHttpClient(),
  ]
}
