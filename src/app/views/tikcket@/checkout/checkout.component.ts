import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '@core/services/event/event.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit{
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _Router = inject(Router)
  private readonly _ToastrService = inject(ToastrService)

  eventId:string | null = null
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
  show:boolean = false

  viewCheckOutData():void{
    if( this.checkoutForm.valid ){
      this.show = true
      this.checkoutData = this.checkoutForm.value
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

    if(this.checkoutForm.valid){
      // Swal.fire(" Checkout Successfully, Check Your E-Mail", '', 'success')
      Swal.fire("Thank you for booking, Please visit the office to pay and receive you Qrcode ticket", '', 'success')
      this.checkoutForm.reset()
      this.photoPreview = null
      this._Router.navigate(['/home'])
    } else {
      Swal.fire("Please Fill All Fields", '', 'error')
    }

    // إرسال الفورم
    // this._EventService.checkoutEvent(formData).subscribe({
    //   next: (res) => {
    //     this._ToastrService.success(
    //       'Checkout Successfully, Check Your E-Mail',
    //       'Success',
    //       { timeOut: 5000 }
    //     );
    //   },
    //   error: (err) => {
    //     console.error(err);
    //   }
    // });
  }




}
