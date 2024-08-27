import {Routes} from "@angular/router";
import {PlayGameComponent} from "./pages/play-game/play-game.component";
import {AboutUsComponent} from "./pages/about-us/about-us.component";
import { LandingPageComponent } from "./pages/landing-page/landing-page.component";


export const routes: Routes = [
  {
    path: "start",
    component: LandingPageComponent,
  },
  {
    path: "play",
    component: PlayGameComponent,
  },
  {
    path: "about",
    component: AboutUsComponent,
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "play"
  }
]
