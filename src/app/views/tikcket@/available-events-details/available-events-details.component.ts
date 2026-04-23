import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { EventService } from '@core/services/event/event.service';
import { UsersService } from '@core/services/users/users.service';
import { NgbAccordionModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-available-events-details',
  imports: [CommonModule, NgbAccordionModule, RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule, FormsModule],
  templateUrl: './available-events-details.component.html',
  styleUrl: './available-events-details.component.scss'
})
export class AvailableEventsDetailsComponent {
  private readonly _EventService = inject(EventService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _UsersService = inject(UsersService)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _AuthService = inject(AuthService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _Router = inject(Router)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)
  private modalService = inject(NgbModal)

  eventData:any
  OwnerName:any
  eventId:string = ''
  userId:string | null = localStorage.getItem('userId')
  token:string | null = localStorage.getItem('token')
  haveAcc: boolean = true;
  features: string[] = [];
  terms: string[] = [];

  OTP:number | string = ''
  CheckOTP:number | string = ''
  otpMsg:string = ''

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
          this.getUserById(this.eventData.OwnerId)
          this.features = this.formatEventDetails(this.eventData?.EventDetails);
          this.terms = this.formatEventDetails(this.eventData?.TermsOfEntries);
          this._NgxSpinnerService.hide()
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  getUserById(id: string):void{
    this._UsersService.getUserById(id).subscribe({
      next:(res)=>{
        this.OwnerName = res.fullName
      }
    })
  }

  // ✅ function تحويل الـ string لـ array نظيف
  formatEventDetails(details: string): string[] {
    if (!details) return [];

    return details
      .split(/\s*[-.]\s*/) // يقسم على - أو .
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  openModal(content: TemplateRef<HTMLElement>, options: NgbModalOptions):void {
    this.modalService.open(content, options)
  }

  toggleForm():void {
    this.haveAcc = !this.haveAcc;
  }

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
      "User",
      [
        Validators.required
      ]
    ],
  });


  generateOTP():void{
    this.OTP = Math.floor(100000 + Math.random() * 900000);
    this.sendOTP()
  }

  submitRegisterForm(): void {
    this._NgxSpinnerService.show()

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this._NgxSpinnerService.hide()
      return;
    }

    if (!this.CheckOTP || this.CheckOTP.toString().length !== 6) {
      this._ToastrService.error('Please enter a valid 6-digit OTP');
      this.otpMsg = 'Please enter a valid 6-digit OTP'
      this._NgxSpinnerService.hide()
      return;
    }

    if (this.OTP != this.CheckOTP) {
      this._ToastrService.error('Incorrect OTP. Please try again');
      this.otpMsg = 'Incorrect OTP. Please try again'
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
        localStorage.setItem('fullNameAr', res.fullNameAr);
        localStorage.setItem('email', res.email);
        localStorage.setItem('phone', res.phone);
        localStorage.setItem('role', res.role);

        this.registerForm.reset({ role: 'User' });

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

  resetOTP():void{
    this.OTP = ''
  }

  // Email Send
  async sendOTP() {
    emailjs.init('yDyM7-toHXTAEsac-');
    try {
      const send = await emailjs.send("service_r4d7bwe","template_6tblq3h",{
        name: this.registerForm.value.fullName,
        otp: this.OTP,
        email: this.registerForm.value.email,
      });

      this._ToastrService.success('OTP Sent To Email');

      return send;
    } catch (err) {
      console.error('EMAIL ERROR:', err);
      this._ToastrService.warning('Email failed but booking is saved');
      throw err;
    }
  }

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
