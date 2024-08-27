import {Routes} from "@angular/router";
import {PlayGameComponent} from "./pages/play-game/play-game.component";


export const routes: Routes = [
  {
    path: "play",
    component: PlayGameComponent,
  },
  {
    path: "about",
    loadComponent: () => import('src/app/pages/about-us/about-us.component').then(m=>m.AboutUsComponent)
  },
  {
    path: "gamerules",
    loadComponent: ()=> import('src/app/pages/game-rules/game-rules.component').then(m=>m.GameRulesComponent)
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "play"
  }
]
