import { DecimalPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '@core/services/booking/booking.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-attendees-details',
  imports: [DecimalPipe, NgClass],
  templateUrl: './attendees-details.component.html',
  styleUrl: './attendees-details.component.scss'
})
export class AttendeesDetailsComponent implements OnInit{
  private readonly _BookingService = inject(BookingService)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)

  bookingDate:any = {}
  bookingId:string | null = ''
  TotalOutComersPrice:number = 0

  ngOnInit(): void {
    this.getBookById()
  }
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
}
