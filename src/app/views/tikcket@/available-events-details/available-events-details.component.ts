import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { EventService } from '@core/services/event/event.service';
import { NgbAccordionModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
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
  private modalService = inject(NgbModal)

  eventData:any
  eventId:string | null = null
  token:string | null = localStorage.getItem('token')
  haveAcc: boolean = true;

  ngOnInit(): void {
    this.getEventById()
  }

  getEventById(): void {
    this._ActivatedRoute.paramMap
      .pipe(
        switchMap(params => {
          this.eventId = params.get('id');
          return this._EventService.getEventById(this.eventId);
        })
      )
      .subscribe({
        next: (res) => {
          this.eventData = res.data;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  get eventDetailsList(): string[] {
    if (!this.eventData?.eventDetails) return [];
    return this.eventData.eventDetails
      .split('\r\n')          // نفصل كل سطر
      .map((item:any) => item.trim()) // نشيل أي فراغات
      .filter((item:any) => item);    // نشيل أي عناصر فاضية
  }

  get termsList(): string[] {
    if (!this.eventData?.termsOfEntries) return [];
    return this.eventData.termsOfEntries
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

  signUpUser:FormGroup = this._FormBuilder.group({
    roleId:['33333333-3333-3333-3333-333333333333'],
    fullName:[null],
    phone:[null],
    email:[null],
    password:[null],
  })

  signInUser:FormGroup = this._FormBuilder.group({
    Username:[null],
    Password:[null],
  })

  submitSignUpForm():void{
    let data = this.signUpUser.value
    console.log(data);
  }

  submitSignInForm():void{
    let data = this.signInUser.value
    this._AuthService.login(data).subscribe({
      next:(res)=>{
        this._ToastrService.success('Create User Successfully')
        this._Router.navigate([`/checkout/${this.eventData?.id}`])
        localStorage.setItem('userId', res.data.userId)
        localStorage.setItem('fullName', res.data.fullName)
        localStorage.setItem('accessToken', res.data.accessToken)
        localStorage.setItem('refreshToken', res.data.refreshToken)
        localStorage.setItem('roles', res.data.roles[0])
      }
    })
  }




}
