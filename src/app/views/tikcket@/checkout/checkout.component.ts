import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@core/services/event/event.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit{
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _EventService = inject(EventService)
  private readonly _ToastrService = inject(ToastrService)

  eventId:string | null = null
  photoPreview: string | ArrayBuffer | null = null;

  ngOnInit(): void {
    this.getEventId()
  }

  checkoutForm:FormGroup = this._FormBuilder.group({
    EventId:[null],
    Photo:[null],
    FullName :[null],
    Phone :[null],
    Email :[null],
    VisitorCount:[null],
  })

  getEventId():void{
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.eventId = params.get('id')
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
  viewCheckOutData():void{
    this.checkoutData = this.checkoutForm.value
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
        this._ToastrService.success(
          'Checkout Successfully, Check Your E-Mail',
          'Success',
          { timeOut: 5000 }
        );
      },
      error: (err) => {
        console.error(err);
      }
    });
  }




}
