import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { EventService } from '@core/services/event/event.service';
import { NgbAccordionModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-available-events-details',
  imports: [CommonModule, NgbAccordionModule, RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './available-events-details.component.html',
  styleUrl: './available-events-details.component.scss'
})
export class AvailableEventsDetailsComponent {
  private readonly _EventService = inject(EventService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _AuthService = inject(AuthService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _Router = inject(Router)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)
  private modalService = inject(NgbModal)

  eventData:any
  eventId:string = ''
  userId:string | null = localStorage.getItem('userId')
  token:string | null = localStorage.getItem('token')
  haveAcc: boolean = true;

  ngOnInit(): void {
    this.getEventById()
  }

  getEventById(): void {
    this._NgxSpinnerService.show()

    this._ActivatedRoute.paramMap
      .pipe(
        switchMap(params => {
          this.eventId = params.get('id')!;
          return this._EventService.getEventById(this.eventId);
        })
      )
      .subscribe({
        next: (res) => {
          this.eventData = res;
          this._NgxSpinnerService.hide()
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  get eventDetailsList(): string[] {
    if (!this.eventData?.EventDetails) return [];
    return this.eventData.EventDetails
      .split('\r\n')          // نفصل كل سطر
      .map((item:any) => item.trim()) // نشيل أي فراغات
      .filter((item:any) => item);    // نشيل أي عناصر فاضية
  }

  get termsList(): string[] {
    if (!this.eventData?.TermsOfEntries) return [];
    return this.eventData.TermsOfEntries
      .split('\r\n')          // نفصل كل شرط على سطر
      .map((item:any) => item.trim()) // نشيل أي فراغات
      .filter((item:any) => item);    // نشيل أي عناصر فاضية
  }

  openModal(content: TemplateRef<HTMLElement>, options: NgbModalOptions):void {
    this.modalService.open(content, options)
  }

  toggleForm():void {
    this.haveAcc = !this.haveAcc;
  }

  registerForm: FormGroup = this._FormBuilder.group({
    fullName: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    phone: [null, [Validators.required]],
    password: [null, [Validators.required, Validators.minLength(6)]],
    role: ["User", [Validators.required]],
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
        this._NgxSpinnerService.hide()

        localStorage.setItem('userId', res.uid);
        localStorage.setItem('fullName', res.fullName);
        localStorage.setItem('email', res.email);
        localStorage.setItem('phone', res.phone);
        localStorage.setItem('role', res.role);

        this.registerForm.reset({ role: 'user' });

        this._Router.navigate([`/checkout/${this.eventData?.id}`]).then(() => {
          window.location.reload();
        });
      },
      error: (err) => {
        switch (err.code) {
          case 'auth/email-already-in-use':
            this._ToastrService.error('This email is already registered');
            break;

          case 'auth/invalid-email':
            this._ToastrService .error('Invalid email format');
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

  loginForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(6)]],
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
        localStorage.setItem('email', res.email);
        localStorage.setItem('phone', res.phone);
        localStorage.setItem('role', res.role);
        this._Router.navigate([`/checkout/${this.eventData?.id}`]).then(() => {
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
