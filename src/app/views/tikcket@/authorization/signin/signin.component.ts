import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LogoBoxComponent } from '@component/logo-box.component';
import { AuthService } from '@core/services/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _AuthService = inject(AuthService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)
  private readonly _Router = inject(Router)

  loginForm: FormGroup = this._FormBuilder.group({
    email: [
      null,
      [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      ]
    ],
    password: [
      null,
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]
    ],
  });

  submitLogin(): void {
    this._NgxSpinnerService.show()

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this._NgxSpinnerService.hide()
      return;
    }

    const { email, password } = this.loginForm.value;

    this._AuthService.login(email!, password!).subscribe({
      next: (res: any) => {
        this._ToastrService.success('Login Successfully');
        this._NgxSpinnerService.hide()

        localStorage.setItem('userId', res.uid);
        localStorage.setItem('fullName', res.fullName);
        localStorage.setItem('fullNameAr', res.fullNameAr);
        localStorage.setItem('email', res.email);
        localStorage.setItem('phone', res.phone);
        localStorage.setItem('role', res.role);

        this._Router.navigate([`/}`]).then(() => {
          window.location.reload();
        });
      },
      error: (err) => {
        this._NgxSpinnerService.hide()
        if (err.code === 'auth/invalid-credential') {
          this._ToastrService.error('Invalid email or password');
        } else {
          this._ToastrService.error('Login failed');
        }
      }
    });
  }
}
