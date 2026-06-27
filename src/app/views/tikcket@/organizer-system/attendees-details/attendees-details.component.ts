import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '@core/services/booking/booking.service';
import { EventService } from '@core/services/event/event.service';
import { serverTimestamp, Timestamp } from 'firebase/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-attendees-details',
  imports: [DecimalPipe, NgClass, DatePipe, FormsModule],
  templateUrl: './attendees-details.component.html',
  styleUrl: './attendees-details.component.scss'
})
export class AttendeesDetailsComponent implements OnInit{
  private readonly _BookingService = inject(BookingService)
  private readonly _EventService = inject(EventService)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _ToastrService = inject(ToastrService)


  eventDate:any = {}
  bookingDate:any = {}
  bookingId:string | null = ''
  TotalOutComersPrice:number = 0
  outcomerPayments: number[] = [];

  ngOnInit(): void {
    this.getBookById()
  }

  // Get Event By Id
  getEventById():void{
    this._EventService.getEventById(this.bookingDate?.EventId).subscribe({
      next:(res)=>{
        this.eventDate = res
        console.log(this.eventDate);
      }
    })
  }

  // Get Booking By Id
  getBookById(): void {
    this._NgxSpinnerService.show();

    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>[
        this.bookingId = params.get('id'),

        this._BookingService.getBookingById(this.bookingId!).subscribe({
          next: (res) => {
            this._NgxSpinnerService.hide();
            this.bookingDate = res;
            console.log(this.bookingDate);
            this.getEventById();

            this.TotalOutComersPrice = (this.bookingDate.newOutcomers || []).reduce(
              (sum: number, item: any) => sum + Number(item.price || 0),
              0
            );
          },
          error: (err) => {
            this._NgxSpinnerService.hide();
            console.error(err);
          }
        })
      ]
    })
  }


  // Check Amount Paid Outcomers Payments
  loadingIndex: number | null = null;
  confirmOutcomerPayment(amount: number, index: number) {

    this._NgxSpinnerService.show();

    // نسخة من الـ Array
    const newOutcomers = [...this.bookingDate.newOutcomers];

    // تحديث العنصر المطلوب
    newOutcomers[index] = {
      ...newOutcomers[index],
      price: amount,
      createCheckAt: Timestamp.now()
    };

    this._BookingService.updateBooking(this.bookingDate.id, {
      newOutcomers
    }).subscribe({
      next: () => {

        // تحديث الـ UI بدون Refresh
        this.bookingDate.newOutcomers = newOutcomers;

        this.outcomerPayments[index] = null!;

        this._NgxSpinnerService.hide();
        this._ToastrService.success('Outcomer payment confirmed');

      },
      error: (err) => {
        console.error(err);
        this._NgxSpinnerService.hide();
        this._ToastrService.error('Failed to confirm payment');
      }
    });

  }
}
