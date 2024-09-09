import {
  AfterViewInit,
  Component, ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal
} from "@angular/core";
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
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  private minWindowHeightPx?: number;
  private minWindowWidthPx?: number;

  private host: ElementRef = inject(ElementRef);
  private router = inject(Router);
  private _routerEventSubscription?: Subscription;

  protected loading: WritableSignal<boolean> = signal(false);
  protected mobile: WritableSignal<boolean> = signal(false);

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

  ngAfterViewInit() {

    const scssValY = window.getComputedStyle(this.host.nativeElement).getPropertyValue('--app-min-window-height');
    this.minWindowHeightPx = Number(scssValY.substring(0, scssValY.indexOf('p')))

    const scssValX = window.getComputedStyle(this.host.nativeElement).getPropertyValue('--app-min-window-width')
    this.minWindowWidthPx = Number(scssValX.substring(0, scssValX.indexOf('p')))

    this.refreshMobileSignal();
  }

  ngOnDestroy() {
    this._routerEventSubscription?.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  windowResize() {
    this.refreshMobileSignal();
  }

  refreshMobileSignal() {
    if (!this.minWindowHeightPx || !this.minWindowWidthPx) {
      this.mobile.set(false);
    } else {
      this.mobile.set(window.innerWidth<this.minWindowWidthPx || window.innerHeight<this.minWindowHeightPx)
    }
  }
}
