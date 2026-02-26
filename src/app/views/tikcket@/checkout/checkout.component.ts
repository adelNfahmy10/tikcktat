import { CommonModule, NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive';
import { AuthService } from '@core/services/auth/auth.service';
import { EventService } from '@core/services/event/event.service';
import Choices from 'choices.js';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

export interface Seat {
  id: string;
  number: number;
  status: 'available' | 'booked' | 'selected';
}

export interface Block {
  name: string;
  seats: Seat[];
}

export interface Row {
  name: string;
  blocks: Block[];
}

export interface Category {
  id: string;
  name: string;
  price: number;
  rows: Row[];
}

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, NgClass, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, AfterViewInit{
  private readonly _AuthService = inject(AuthService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _Router = inject(Router)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _EventService = inject(EventService)

  eventType:string | null = null
  eventId:string | null = null
  userData:any = {}
  userId:string | null = localStorage.getItem('userId')
  eventData:any = {}
  photoPreview: string | ArrayBuffer | null = null;
  @ViewChild('phoneSelect') phoneSelect!: ElementRef;

  phones: string[] = [
    '01012345678',
    '01198765432',
    '01234567890',
    '01587654321',
    '01056789012',
    '01123456789',
    '01298765432',
    '01512349876',
    '01087654321',
    '01134567890',
    '01256789012',
    '01523456789',
    '01098765432',
    '01112345678',
    '01287654321',
    '01534567890',
    '01023456789',
    '01156789012',
    '01212349876',
    '01598765432'
  ];

  ngAfterViewInit(): void {
    if(this.phoneSelect?.nativeElement){
       new Choices(this.phoneSelect?.nativeElement, {
        searchEnabled: true,      // تفعيل البحث
        searchPlaceholderValue: 'Search...', // placeholder داخل البحث
        // shouldSort: false,        // لو عايز يظهر بالترتيب اللي في الـ array
        itemSelectText: '',       // يشيل النص الافتراضي عند اختيار عنصر
      });
    }

  }

  ngOnInit(): void {
    this.getEventId()
    this.getUserById()
    this.generateLayout();
  }

  checkoutForm:FormGroup = this._FormBuilder.group({
    EventId:[null, Validators.required],
    Photo:[null],
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
            this.eventType = this.eventData.type
          }
        })
      }
    })
  }

  getUserById():void{
    this._AuthService.getUserById(this.userId).subscribe({
      next:(res)=>{
        this.userData = res.data
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
      if(this.eventData.type != 'FunDayEvent'){
        this.total = this.subTotal + this.tax;
      } else {
        this.total = this.subTotal
      }
    } else {
      this.show = false
    }
  }

  submitCheckout(): void {
    // تأكد ان الـ eventId موجود
    if (!this.eventId) return;

    let formValue = this.checkoutForm.value;
    formValue.FullName = this.userData.fullName
    formValue.Photo = this.userData.mobile
    formValue.Email = this.userData.email

    const formData = new FormData();
    // أضف EventId
    formData.append('EventId', this.eventId);

    console.log(formValue);


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
    // this._EventService.checkoutEvent(formData).subscribe({
    //   next: (res) => {
    //     Swal.fire(res.msg, '', 'success').then(() => {
    //       this.checkoutForm.reset();
    //       this.photoPreview = null;
    //       this._Router.navigate(['/home']);
    //     });
    //   },
    //   error: (err) => {
    //     Swal.fire({
    //       icon: 'error',
    //       title: err.error?.msg || 'Email Or Phone Already Existed'
    //     });
    //   }
    // });
  }

  categories: Category[] = [];
  selectedSeats: Seat[] = [];

  generateLayout(): void {
    const config = [
      { id:'vip', name:'VIP', rows:5, blocks:3, seatsPerBlock:6, price:500 },
      { id:'regular', name:'Regular', rows:8, blocks:2, seatsPerBlock:10, price:250 },
      { id:'balcony', name:'Balcony', rows:4, blocks:4, seatsPerBlock:5, price:150 }
    ];

    let globalRowIndex = 0; // لتسلسل الحروف بين كل categories

    config.forEach(cat => {

      const rows: Row[] = [];

      for (let r = 0; r < cat.rows; r++) {

        const rowLetter = String.fromCharCode(65 + globalRowIndex);
        globalRowIndex++;

        const blocks: Block[] = [];
        let seatNumber = 1; // كل صف رقم يبدأ من 1 ويكمل عبر كل blocks

        for (let b = 0; b < cat.blocks; b++) {

          const seats: Seat[] = [];

          for (let s = 1; s <= cat.seatsPerBlock; s++) {
            seats.push({
              id: `${rowLetter}${seatNumber++}`, // رقم متسلسل عبر كل الصف
              number: seatNumber - 1,
              status: Math.random() > 0.9 ? 'booked' : 'available'
            });
          }

          blocks.push({ name:`B${b+1}`, seats });
        }

        rows.push({ name: rowLetter, blocks });
      }

      this.categories.push({
        id: cat.id,
        name: cat.name,
        price: cat.price,
        rows
      });

    });
  }

  toggleSeat(seat: Seat) {
    if (seat.status === 'booked') return;

    if (seat.status === 'selected') {
      seat.status = 'available';
      this.selectedSeats =
        this.selectedSeats.filter(s => s.id !== seat.id);
    } else {
      seat.status = 'selected';
      this.selectedSeats.push(seat);
    }
  }



}
