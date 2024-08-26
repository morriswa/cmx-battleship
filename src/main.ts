import { enableProdMode } from '@angular/core';
import {bootstrapApplication} from "@angular/platform-browser";
import {AppConfig} from "./app/config";
import {AppComponent} from "./app/app.component";

if (process.env['RUNTIME']==='prod') {
  enableProdMode();
}

bootstrapApplication(AppComponent, AppConfig).catch(err=>console.error(err));
