import { CommonModule, NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive';
import { AuthService } from '@core/services/auth/auth.service';
import { BookingService } from '@core/services/booking/booking.service';
import { EventService } from '@core/services/event/event.service';
import { PaymentService } from '@core/services/payment/payment.service';
import { UsersService } from '@core/services/users/users.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
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
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private readonly _UsersService = inject(UsersService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _Router = inject(Router)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _EventService = inject(EventService)
  private readonly _BookingService = inject(BookingService)
  private modalService = inject(NgbModal)

  userId:string | null = localStorage.getItem('userId')
  userData:any = {}
  eventData:any = {}
  eventId:string | null = null
  transactionRef:string = ''

  selectedFile!: File | null;
  photoPreview: string | ArrayBuffer | null = null;
  selectedPaymentFile!: File | null;
  paymentImagePreview: string | ArrayBuffer | null = null;
  checkoutData:any = {}
  subTotal:number = 0
  total:number = 0
  tax:number = 0.20

  isReturningUser:boolean = false
  bookingData: any = null;


  ngOnInit(): void {
    this.getEventId()
    this.getUserById()
    // this.generateLayout();
  }

  getEventId(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        this.eventId = params.get('id')!;

        this._EventService.getEventById(this.eventId).subscribe({
          next: (res) => {
            this.eventData = res;
            console.log(this.eventData);
          }
        });

        // 🔥 check هنا مباشرة
        this._BookingService.checkUserBooking(this.eventId, this.userId!)
          .subscribe((booking) => {

            if (booking) {
              this.isReturningUser = true;
              this.bookingData = booking;

              console.log('🔥 Returning User:', booking);

            } else {
              this.isReturningUser = false;

              console.log('🟢 First Time User');
            }

          });
      }
    });
  }

  getUserById():void{
    this._UsersService.getUserById(this.userId!).subscribe({
      next:(res)=>{
        this.userData = res
      }
    })
  }

  checkoutForm:FormGroup = this._FormBuilder.group({
    EventId:[null, Validators.required],
    EventName:[null, Validators.required],
    OwnerId:[null, Validators.required],

    userId:[null, Validators.required],
    userName:[null, Validators.required],
    userPhone:[null, Validators.required],
    userEmail:[null, Validators.required],
    userImage:[null],
    defaultVisitorCount:[null, [Validators.required, Validators.min(0)]],
    VisitorCount:[null, [Validators.required, Validators.min(0)]],

    payOneAmount:[null],
    payOneImage:[null],
    payOneRef:[null, [ Validators.required, Validators.pattern(/^[0-9]{12}$/)]],

    payTwoAmount:[null],
    payTwoImage:[null],
    payTwoRef:[null, [ Validators.required, Validators.pattern(/^[0-9]{12}$/)]],

    totalAmount:[null, [Validators.required, Validators.min(0)]],
  })

  // Modal Check Data Logic
  openModal(content: TemplateRef<HTMLElement>, options: NgbModalOptions) {
    if(this.userData.fullName && this.userData.phone && this.userData.email){
      this.modalService.open(content, options)
      this.checkoutData = this.checkoutForm.value
      let price  = this.eventData?.TicketPrice
      let companionPrice  = this.checkoutData?.VisitorCount * this.eventData?.VisitorPrice
      this.subTotal = price + companionPrice

      // الضريبة 2.7% من الإجمالي + 23 ثابت
      this.tax = Math.ceil((this.subTotal * 0.020)) ;
      // الإجمالي النهائي
      this.total = this.subTotal + this.tax;
    } else {
      this._ToastrService.error('Faild To Cntinue')
    }
  }

  // // Checkout Logic
  async submitCheckout(): Promise<void> {
    // ✅ 1. Validate
    if (!this.eventId || !this.selectedFile || this.transactionRef?.length !== 12) {
      this._ToastrService.error('Missing data');
      return;
    }

    try {
      // 🔥 2. Upload image
      const imageUrl = await this._EventService.uploadImage(this.selectedFile);
      const imagePaymentUrl = await this._EventService.uploadImage(this.selectedPaymentFile!);

      const formValue = this.checkoutForm.value;

      const finalData = {
        ...formValue,
        EventId: this.eventId,
        EventName: this.eventData.EventName,
        OwnerId: this.eventData.OwnerId,

        userId: this.userId,
        userName: this.userData.fullName,
        userPhone: this.userData.phone,
        userEmail: this.userData.email,
        userImage: imageUrl,
        defaultVisitorCount: 2,
        VisitorCount: null,

        payOneAmount: 0,
        payOneImage: imagePaymentUrl,
        payOneRef: this.transactionRef,

        payTwoAmount: 0,
        payTwoImage: '',
        payTwoRef: '',

        totalAmount: 0,

        status: 'Pending',
        createdAt: new Date()
      };

      // 🔥 1. Save booking
      this._BookingService.createBooking(finalData).subscribe({
        next: () => {
          // 🔥 2. Update tickets
          this._EventService.updateEventTickets(
            this.eventId!,
            1
          ).subscribe();

          this.checkoutForm.reset();
          this.tax = 0
          this.subTotal = 0
          this.total = 0
          this.transactionRef = ''
          this.selectedFile = null
          this.selectedPaymentFile = null
          this.photoPreview = ''
          this.paymentImagePreview = ''
          this.checkoutData = {}
          this._ToastrService.success('Booking Created Successfully');
          this.modalService.dismissAll();
          this._Router.navigate(['/payment-success'])
        },
        error: () => {
          this._ToastrService.error('Booking Failed');
        }
      });

    } catch (err) {
      console.error(err);
      this._ToastrService.error('Checkout failed');
    }
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.photoPreview = reader.result;
    };

    reader.readAsDataURL(this.selectedFile);
  }

  onPaymentImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    this.selectedPaymentFile = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.paymentImagePreview = reader.result;
    };

    reader.readAsDataURL(this.selectedPaymentFile);
  }


  visitorCount:number = 0
  paidTwo:number = 0

  calculatePriceAfterFinalPaid(): void {
    if (this.isReturningUser) {

      this.paidTwo = this.eventData.VisitorPrice * this.visitorCount;

      this.subTotal = (this.eventData.TicketPrice - this.bookingData.payOneAmount || 0) + this.paidTwo;

      this.tax = this.subTotal * 0.02; // مثال 2%

      this.total = this.subTotal + this.tax;
    }
  }


  async continueBooking(){
    if (this.isReturningUser) {
      const imagePaymentUrl = await this._EventService.uploadImage(this.selectedPaymentFile!);

      this._BookingService.updateBooking(this.bookingData.id, {
        VisitorCount: this.visitorCount,

        payTwoAmount: 0,
        payTwoImage: imagePaymentUrl,
        payTwoRef: this.transactionRef,

        totalAmount: 0,

      }).subscribe({
        next: () => {
          console.log('✅ Phase 2 Completed');
          this._ToastrService.success('Booking Completed Successfully');

          this.visitorCount = 0
          this.paidTwo = 0
          this.tax = 0
          this.subTotal = 0
          this.total = 0
          this.transactionRef = ''
          this.selectedFile = null
          this.selectedPaymentFile = null
          this.photoPreview = ''
          this.paymentImagePreview = ''
          this.checkoutData = {}
          this.modalService.dismissAll();
          this._Router.navigate(['/payment-success'])
        },
        error: (err) => {
          console.error(err);
          this._ToastrService.error('Update Failed');
        }
      });

    }
  }


  // // Seating Layout Logic
  // categories: Category[] = [];
  // selectedSeats: Seat[] = [];

  // generateLayout(): void {
  //   const config = [
  //     { id:'vip', name:'VIP', rows:5, blocks:3, seatsPerBlock:6, price:500 },
  //     { id:'regular', name:'Regular', rows:8, blocks:2, seatsPerBlock:10, price:250 },
  //     { id:'balcony', name:'Balcony', rows:4, blocks:4, seatsPerBlock:5, price:150 }
  //   ];

  //   let globalRowIndex = 0; // لتسلسل الحروف بين كل categories

  //   config.forEach(cat => {

  //     const rows: Row[] = [];

  //     for (let r = 0; r < cat.rows; r++) {

  //       const rowLetter = String.fromCharCode(65 + globalRowIndex);
  //       globalRowIndex++;

  //       const blocks: Block[] = [];
  //       let seatNumber = 1; // كل صف رقم يبدأ من 1 ويكمل عبر كل blocks

  //       for (let b = 0; b < cat.blocks; b++) {

  //         const seats: Seat[] = [];

  //         for (let s = 1; s <= cat.seatsPerBlock; s++) {
  //           seats.push({
  //             id: `${rowLetter}${seatNumber++}`, // رقم متسلسل عبر كل الصف
  //             number: seatNumber - 1,
  //             status: Math.random() > 0.9 ? 'booked' : 'available'
  //           });
  //         }

  //         blocks.push({ name:`B${b+1}`, seats });
  //       }

  //       rows.push({ name: rowLetter, blocks });
  //     }

  //     this.categories.push({
  //       id: cat.id,
  //       name: cat.name,
  //       price: cat.price,
  //       rows
  //     });

  //   });
  // }

  // toggleSeat(seat: Seat) {
  //   if (seat.status === 'booked') return;

  //   if (seat.status === 'selected') {
  //     seat.status = 'available';
  //     this.selectedSeats =
  //       this.selectedSeats.filter(s => s.id !== seat.id);
  //   } else {
  //     seat.status = 'selected';
  //     this.selectedSeats.push(seat);
  //   }
  // }
}
