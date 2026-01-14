import { inject } from '@angular/core'
import { Router, Routes } from '@angular/router'
import { AuthenticationService } from '@core/services/auth.service'
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component'
import { MainLayoutComponent } from '@layouts/main-layout/main-layout.component'
import { ComingSoonComponent } from '@views/extra/coming-soon/coming-soon.component'
import { Error404Component } from '@views/extra/error404/error404.component'
import { MaintenanceComponent } from '@views/extra/maintenance/maintenance.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayoutComponent,
    loadChildren: () =>
      import('./views/views.route').then((mod) => mod.VIEWS_ROUTES),
    canActivate: [
      (url: any) => {
        const router = inject(Router)
        const authService = inject(AuthenticationService)
        if (!authService.session) {
          return router.createUrlTree(['/auth/sign-in'], {
            queryParams: { returnUrl: url._routerState.url },
          })
        }
        return true
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./views/auth/auth.route').then((mod) => mod.AUTH_ROUTES),
  },
  {
    path: 'pages',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./views/extra/extra.route').then((mod) => mod.OTHER_PAGE_ROUTE),
  },
]
