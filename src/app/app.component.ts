import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, ViewChild, type OnInit } from '@angular/core'
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
  type Event,
} from '@angular/router'
import { TitleService } from '@core/services/title.service'
import {
  NgProgressComponent,
  NgProgressModule,
  type NgProgressRef,
} from 'ngx-progressbar'
import { NgxSpinnerComponent } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
declare let gtag: Function;

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NgProgressModule, NgxSpinnerComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  progressRef!: NgProgressRef
  @ViewChild(NgProgressComponent) progressBar!: NgProgressComponent

  private titleService = inject(TitleService)
  private router = inject(Router)
  private _ToastrService = inject(ToastrService)

  constructor() {
    this.router.events.subscribe((event: Event) => {
      this.checkRouteChange(event)
    })

    this.router.events.subscribe((event: Event) => {

      if (event instanceof NavigationEnd) {

        // GA4 page tracking
        gtag('config', 'G-GVN1P4DPJ5', {
          page_path: event.urlAfterRedirects
        });

      }
    });
  }

  ngOnInit(): void {
    this.titleService.init()
    // ⏳ استنى شوية عشان login أو تحميل الداتا
    setTimeout(() => {
      this.initStorageWatcher();
    }, 1500);
  }

  checkRouteChange(routerEvent: Event) {
    if (routerEvent instanceof NavigationStart) {
      this.progressBar.start()
    }
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      setTimeout(() => {
        this.progressBar.complete()
      }, 200)
    }
  }

  initialUserId: string | null = null;
  initialRole: string | null = null;
  intervalId: any;
  isWatching = false;

  initStorageWatcher(): void {
    if (this.isWatching) return;

    this.initialUserId = localStorage.getItem('userId');
    this.initialRole = localStorage.getItem('role');

    this.isWatching = true;

    this.intervalId = setInterval(() => {
      const currentUserId = localStorage.getItem('userId');
      const currentRole = localStorage.getItem('role');

      if (
        currentUserId !== this.initialUserId ||
        currentRole !== this.initialRole
      ) {
        this.forceLogout();
      }
    }, 1000);
  }

  forceLogout(): void {
    clearInterval(this.intervalId);

    localStorage.clear();

    this._ToastrService.error(
      'You have been logged out due to unauthorized changes'
    );

   this.router.navigate(['/']).then(() => {
      window.location.reload();
    });

  }

}
