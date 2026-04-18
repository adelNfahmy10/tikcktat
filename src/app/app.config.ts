import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core'
import {
  provideRouter,
  withInMemoryScrolling,
  type InMemoryScrollingFeature,
  type InMemoryScrollingOptions,
} from '@angular/router'
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http'

import { routes } from './app.routes'
import { provideStore } from '@ngrx/store'
import { rootReducer } from './store'
import { localStorageSyncReducer } from '@store/layout/layout-reducers'
import { provideEffects } from '@ngrx/effects'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { CalendarEffects } from '@store/calendar/calendar.effects'
import { CookieService } from 'ngx-cookie-service'
import { AuthenticationEffects } from '@store/authentication/authentication.effects'
import { FakeBackendProvider } from '@core/helper/fake-backend'
import { provideToastr, ToastrModule } from 'ngx-toastr'
import { DecimalPipe } from '@angular/common'
import { headerInterceptor } from '@core/interceptors/header/header.interceptor'
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from '@core/interceptors/loading/loading.interceptor'
import { withHashLocation } from '@angular/router';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app'
import { environment } from '@core/environment/environment'
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth'
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideFunctions } from '@angular/fire/functions'
import { getFunctions } from 'firebase/functions'

ToastrModule.forRoot({
  positionClass: 'toast-bottom-right'
})

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
}

const inMemoryScrollingFeatures: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig)

export const appConfig: ApplicationConfig = {
  providers: [
    FakeBackendProvider,
    CookieService,
    DecimalPipe,
    provideFirebaseApp(() =>
      initializeApp(environment.firebase)
    ),

    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    // provideStorage(() => getStorage()),

    provideFunctions(() =>
      getFunctions()
    ),

    provideAnimations(),
    importProvidersFrom(NgxSpinnerModule, BrowserAnimationsModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation(), inMemoryScrollingFeatures),
    provideStore(rootReducer, { metaReducers: [localStorageSyncReducer] }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(AuthenticationEffects, CalendarEffects),
    provideHttpClient(withFetch(), withInterceptors([headerInterceptor, loadingInterceptor])),
    provideToastr({
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
      preventDuplicates: true
    })
  ],
}
