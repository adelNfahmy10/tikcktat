import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '@core/services/event/event.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, NgClass, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit{
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _Router = inject(Router)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _EventService = inject(EventService)

  eventId:string | null = null
  eventData:any = {}
  photoPreview: string | ArrayBuffer | null = null;

  ngOnInit(): void {
    this.getEventId()
  }

  checkoutForm:FormGroup = this._FormBuilder.group({
    EventId:[null, Validators.required],
    Photo:[null, Validators.required],
    FullName :[null, Validators.required],
    Phone :[null, Validators.required],
    Email :[null, Validators.required],
    VisitorCount:[null],
  })

  getEventId():void{
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.eventId = params.get('id')
        this.checkoutForm.get('EventId')?.setValue(this.eventId)
        this._EventService.getEventById(this.eventId).subscribe({
          next:(res)=>{
            this.eventData = res.data
          }
        })
      }
    })
  }

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // نحطه في الفورم
      this.checkoutForm.patchValue({
        Photo: file
      });
      this.checkoutForm.get('Photo')?.updateValueAndValidity();

      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  checkoutData:any = {}
  subTotal:number = 0
  total:number = 0
  tax:number = 2.7% + 3
  show:boolean = false

  viewCheckOutData():void{
    if( this.checkoutForm.valid ){
      this.show = true
      this.checkoutData = this.checkoutForm.value
      let price  = this.eventData.price
      let companionPrice  = this.checkoutData?.VisitorCount * this.eventData.visitorFee
      this.subTotal = price + companionPrice
      // الضريبة 2.7% من الإجمالي + 23 ثابت
      this.tax = (this.subTotal * 0.027) + 23;
      // الإجمالي النهائي
      this.total = this.subTotal + this.tax;
    } else {
      this.show = false
    }
  }


  submitCheckout(): void {
    // تأكد ان الـ eventId موجود
    if (!this.eventId) return;

    const formData = new FormData();
    const formValue = this.checkoutForm.value;

    // أضف EventId
    formData.append('EventId', this.eventId);

    // أضف باقي الحقول
    Object.keys(formValue).forEach(key => {
      const value = formValue[key];
      if (value !== null && value !== undefined) {
        if (key === 'Photo' && value instanceof File) {
          formData.append('Photo', value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });


    // إرسال الفورم
    this._EventService.checkoutEvent(formData).subscribe({
      next: (res) => {
        Swal.fire(res.msg, '', 'success').then(() => {
          this.checkoutForm.reset();
          this.photoPreview = null;
          this._Router.navigate(['/home']);
        });
      },
      error: (err) => {
        Swal.fire("Please Fill All Fields", '', 'error')
      }
    });
  }




}
