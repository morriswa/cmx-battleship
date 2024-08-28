import {provideRouter} from "@angular/router";
import {routes} from "./routes";
import {ApplicationConfig} from "@angular/core";
import {ApiClient} from "./injectables/api-client.service";



export const AppConfig: ApplicationConfig = {
  providers: [
    // declare global services here
    ApiClient,
    // as well as required ng providers
    provideRouter(routes),
  ]
}
