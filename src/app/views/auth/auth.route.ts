import type { Route } from '@angular/router'
import { SigninComponent } from './signin/signin.component'
import { SignupComponent } from './signup/signup.component'
import { PasswordComponent } from './password/password.component'
import { LockScreenComponent } from './lock-screen/lock-screen.component'

export const AUTH_ROUTES: Route[] = [
  {
    path: 'sign-in',
    component: SigninComponent,
    data: { title: 'Sign In' },
  },
  {
    path: 'sign-up',
    component: SignupComponent,
    data: { title: 'Sign Up' },
  },
  {
    path: 'reset-password',
    component: PasswordComponent,
    data: { title: 'Rest Password' },
  },
  {
    path: 'lock-screen',
    component: LockScreenComponent,
    data: { title: 'Lock Screen' },
  },
]
