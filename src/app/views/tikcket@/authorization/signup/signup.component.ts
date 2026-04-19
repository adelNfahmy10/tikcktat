import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)
  private readonly _Router = inject(Router);

  allRoles: string[] = [
    "Admin",
    "Owner",
    "User"
  ];

  registerForm: FormGroup = this._FormBuilder.group({
    fullName: [
      null,
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z\s]+$/) // English letters only
      ]
    ],

    fullNameAr: [
      null,
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[\u0600-\u06FF\s]+$/) // Arabic letters only
      ]
    ],

    email: [
      null,
      [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      ]
    ],

    phone: [
      null,
      [
        Validators.required,
        Validators.pattern(/^01[0-2,5]{1}[0-9]{8}$/) // Egyptian numbers
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

    role: [
      "Owner",
      [
        Validators.required
      ]
    ],
  });

  submitRegisterForm(): void {
    this._NgxSpinnerService.show()

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this._NgxSpinnerService.hide()
      return;
    }

    const data = this.registerForm.value;


    this._AuthService.register(data).subscribe({
      next: (res) => {
        this._ToastrService.success('Account Created Successfully');
        this._NgxSpinnerService.hide();

        localStorage.setItem('userId', res.uid);
        localStorage.setItem('fullName', res.fullName);
        localStorage.setItem('fullNameAr', res.fullNameAr);
        localStorage.setItem('email', res.email);
        localStorage.setItem('phone', res.phone);
        localStorage.setItem('role', res.role);

        this.registerForm.reset({ role: 'Owner' });

        this._Router.navigate(['/']).then(() => {
          window.location.reload();
        });
      },
      error: (err) => {
        switch (err.code) {
          case 'auth/email-already-in-use':
            this._ToastrService.error('This email is already registered');
            break;

          case 'auth/invalid-email':
            this._ToastrService.error('Invalid email format');
            break;

          case 'auth/weak-password':
            this._ToastrService.error('Password is too weak');
            break;

          default:
            this._ToastrService.error('Registration failed');
        }
        this._NgxSpinnerService.hide()
      }
    });

  }
}
