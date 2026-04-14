import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
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
  private readonly _Router = inject(Router);

  allRoles: string[] = [
    "Admin",
    "Owner",
    "User"
  ];

  registerForm: FormGroup = this._FormBuilder.group({
    fullName: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    phone: [null, [Validators.required]],
    password: [null, [Validators.required, Validators.minLength(6)]],
    role: ["User", [Validators.required]],
  });

  submitRegisterForm(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const data = this.registerForm.value;

    this._AuthService.register(data).subscribe({
      next: (res) => {
        this._ToastrService.success('Account Created Successfully');

        // 👇 Save user in localStorage
        const userData = {
          userId: res.uid,
          fullName: res.fullName,
          email: res.email,
          phone: res.phone,
          role: res.role
        };

        localStorage.setItem('userId', res.uid);
        localStorage.setItem('fullName', res.fullName);
        localStorage.setItem('email', res.email);
        localStorage.setItem('phone', res.phone);
        localStorage.setItem('role', res.role);

        this.registerForm.reset({ role: 'user' });

        this._Router.navigate(['/home']).then(() => {
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
      }
    });
  }
}
