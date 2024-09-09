import {Component, HostListener, inject, OnDestroy, OnInit, signal, WritableSignal} from "@angular/core";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet
} from "@angular/router";
import {Subscription} from "rxjs";
import {FullscreenLoadMaskComponent} from "./components/fullscreen-load-mask/fullscreen-load-mask.component";
import {MobileDisabledMaskComponent} from "./components/mobile-disabled-mask/mobile-disabled-mask.component";

@Component({
  selector: "app-root",
  template: `
    @if (mobile()) {
      <app-mobile-disabled-mask/>
    } @else if (loading()) {
      <app-fullscreen-load-mask/>
    } @else {
      <router-outlet/>
    }
  `,
  standalone: true,
  imports: [
    RouterOutlet,
    FullscreenLoadMaskComponent,
    MobileDisabledMaskComponent
  ]
})
export class AppComponent implements OnInit, OnDestroy{

  private router = inject(Router);
  private _routerEventSubscription?: Subscription;
  protected loading: WritableSignal<boolean> = signal(false);
  protected mobile: WritableSignal<boolean> = signal(window.innerWidth<600);

  ngOnInit() {
    this._routerEventSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading.set(true);
      } else if (
           event instanceof NavigationEnd
        || event instanceof NavigationCancel
        || event instanceof NavigationError
      ) {
        this.loading.set(false);
      }
    });
  }

  ngOnDestroy() {
    this._routerEventSubscription?.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  refreshMobileSignal() {
    this.mobile.set(window.innerWidth<600);
  }
}
