import {Routes} from "@angular/router";
import {PlayGameComponent} from "./pages/play-game/play-game.component";
import {AboutUsComponent} from "./pages/about-us/about-us.component";


export const routes: Routes = [
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
