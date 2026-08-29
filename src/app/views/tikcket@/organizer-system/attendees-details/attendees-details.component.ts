import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '@core/services/booking/booking.service';
import { EventService } from '@core/services/event/event.service';
import { SendmailService } from '@core/services/send-email/sendmail.service';
import { serverTimestamp, Timestamp } from 'firebase/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

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
  private readonly _SendmailService = inject(SendmailService)
  private readonly _ToastrService = inject(ToastrService)


  role:string | null = localStorage.getItem('role')
  userId:string | null = localStorage.getItem('userId')
  eventData:any = {}
  bookingData:any = {}
  bookingId:string | null = ''
  TotalOutComersPrice:number = 0
  outcomerPayments: number[] = [];

  ngOnInit(): void {
    this.getBookById()
  }

  // Get Event By Id
  getEventById():void{
    this._EventService.getEventById(this.bookingData?.EventId).subscribe({
      next:(res)=>{
        this.eventData = res
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
            this.bookingData = res;

            this.getEventById();

            this.TotalOutComersPrice = (this.bookingData.newOutcomers || []).reduce(
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
    const newOutcomers = [...this.bookingData.newOutcomers];

    // تحديث العنصر المطلوب
    newOutcomers[index] = {
      ...newOutcomers[index],
      price: amount,
      createCheckAt: Timestamp.now()
    };

    this._BookingService.updateBooking(this.bookingData.id, {
      newOutcomers
    }).subscribe({
      next: () => {

        // تحديث الـ UI بدون Refresh
        this.bookingData.newOutcomers = newOutcomers;

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

  // Delete Ourcomer
  deleteOutcomers(index: number) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'This outcomer and its QR will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d'
    }).then((result) => {

      if (!result.isConfirmed) return;

      this._NgxSpinnerService.show();

      // الـ Outcomer اللي هيتمسح
      const deletedOutcomer = this.bookingData.newOutcomers[index];
      const deletedCount = deletedOutcomer.count;

      if (!deletedOutcomer) {
        this._NgxSpinnerService.hide();
        return;
      }

      // حذف الـ Outcomer
      const newOutcomers = [...this.bookingData.newOutcomers];
      newOutcomers.splice(index, 1);

      // حذف الـ QR المقابل ليه
      const qrs = this.bookingData.qrs.filter((qr: any) => {

        if (qr.type !== 'guest') {
          return true;
        }

        return !(
          qr.createdAt?.seconds === deletedOutcomer.createdAt?.seconds &&
          qr.createdAt?.nanoseconds === deletedOutcomer.createdAt?.nanoseconds
        );

      });

      const visitorCount = Math.max(0, this.bookingData.VisitorCount - deletedCount);

      const totalVisitors = Math.max(0, this.bookingData.totalVisitors - deletedCount);

      this._BookingService.updateBooking(this.bookingData.id, {
        newOutcomers,
        qrs,
        VisitorCount: visitorCount,
        totalVisitors: totalVisitors
      }).subscribe({
        next: (res) => {
          this.bookingData.newOutcomers = newOutcomers;
          this.bookingData.qrs = qrs;
          this.bookingData.VisitorCount = visitorCount;
          this.bookingData.totalVisitors = totalVisitors;

          this.updateExtraOutcomersCount(this.eventData.id, deletedCount)

          this._NgxSpinnerService.hide();

          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Outcomer deleted successfully.',
            timer: 1500,
            showConfirmButton: false
          });

        },
        error: (err) => {
          console.error(err);
          this._NgxSpinnerService.hide();

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to delete outcomer.'
          });
        }
      });
    });
  }

  updateExtraOutcomersCount(eventId:string, totalOutcomers:number):void{
    if(this.eventData.ExtraOutcomers){
      this._EventService.updateEvent(eventId, {
        ExtraOutcomers: this.eventData.ExtraOutcomers + totalOutcomers
      }).subscribe({
        next: () => {
          this._ToastrService.success('Extra Outcomers Updated successfully.');
        },
        error: (err) => {
          console.error(err);
          this._ToastrService.error('Error updated extra outcomers.');
        }
      });
    } else {
      this._ToastrService.error('Event have not Extra Outcomers.');
    }
  }

  // Send QRs Code | STMP QRS Bravo
  sendFinalQrs(email:string, eventName:string, userName:string, qrs: any[]):void{
    const data = {
      to: email,
      name: userName,
      eventName: eventName,
      qrs: qrs
    };

    this._SendmailService.sendQrs(data).subscribe({
      next: () => {
        this._ToastrService.success('Email Sent');
      },
      error: (err) => {
        console.error(err);
        this._ToastrService.error('Email failed!');
      }
    });
  }

  canSendQrs(): boolean {
    if (!this.bookingData?.newOutcomers?.length) {
      return true;
    }

    return this.bookingData?.newOutcomers?.every((outcomer: any) => !!outcomer.price);
  }
}
