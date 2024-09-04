import {AppRouter} from "./routes.config";
import {ApplicationConfig} from "@angular/core";
import {provideHttpClientTesting} from "@angular/common/http/testing";



export const TestConfig: ApplicationConfig = {
  providers: [
    // declare global services here
    AppRouter,
    provideHttpClientTesting(),
  ]
};
