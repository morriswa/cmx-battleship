import { enableProdMode } from '@angular/core';
import {bootstrapApplication} from "@angular/platform-browser";
import {AppConfig} from "./app/app.config";
import {AppComponent} from "./app/app.component";
import {environment} from "./environments/environment";

if (environment.RUNTIME==='prod') {
  enableProdMode();
}

bootstrapApplication(AppComponent, AppConfig).catch(err=>console.error(err));
