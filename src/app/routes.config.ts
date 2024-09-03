import {provideRouter, Routes} from "@angular/router";
import {PlayGameComponent} from "./pages/play-game/play-game.component";
import {AboutUsComponent} from "./pages/about-us/about-us.component";
import { LandingPageComponent } from "./pages/landing-page/landing-page.component";
import {UserSessionGuard} from "./guards/user-session.guard";
import { LobbyComponent } from "./pages/lobby/lobby.component";
import {EnvironmentProviders} from "@angular/core";
import {ActiveGameGuard} from "./guards/active-game.guard";


const routesConfig: Routes = [
  {
    path: "start",
    component: LandingPageComponent,
  },
  {
    path: "lobby",
    canActivate: [UserSessionGuard],
    component: LobbyComponent,
  },
  {
    path: "play",
    canActivate: [UserSessionGuard, ActiveGameGuard],
    component: PlayGameComponent,
  },
  {
    path: "about",
    component: AboutUsComponent,
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "start"
  }
]

export const AppRouter: EnvironmentProviders
  = provideRouter(routesConfig);
