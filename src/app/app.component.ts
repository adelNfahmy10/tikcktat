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
    // snapshot أول ما الأبليكيشن يفتح
    this.initialStorage = JSON.stringify(localStorage);

    // listen لأي تغيير من tabs تانية
    window.addEventListener('storage', this.detectStorageTampering.bind(this));

    // polling لأي تغيير من نفس الصفحة
    this.startStorageWatcher();
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

  initialStorage: string = '';
  intervalId: any;

  detectStorageTampering() {
    const current = JSON.stringify(localStorage);

    if (current !== this.initialStorage) {
      this.forceLogout();
    }
  }

  startStorageWatcher() {
    this.intervalId = setInterval(() => {
      const current = JSON.stringify(localStorage);

      if (current !== this.initialStorage) {
        this.forceLogout();
      }
    }, 1000);
  }

  forceLogout() {
    clearInterval(this.intervalId);

    localStorage.clear();

    // مهم: نحدث snapshot عشان مايحصلش loop
    this.initialStorage = JSON.stringify(localStorage);

    // optional toast
    this._ToastrService.error('You have been logged out due to unauthorized data changes');

    // redirect
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
