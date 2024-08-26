import {provideRouter} from "@angular/router";
import {routes} from "./routes";
import {ApplicationConfig} from "@angular/core";



export const AppConfig: ApplicationConfig = {
  providers: [
    // declare global services here
    provideRouter(routes),
  ]
}
