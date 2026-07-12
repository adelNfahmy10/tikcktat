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
      const deletedOutcomer = this.bookingDate.newOutcomers[index];
      const deletedCount = deletedOutcomer.count;

      if (!deletedOutcomer) {
        this._NgxSpinnerService.hide();
        return;
      }

      // حذف الـ Outcomer
      const newOutcomers = [...this.bookingDate.newOutcomers];
      newOutcomers.splice(index, 1);

      // حذف الـ QR المقابل ليه
      const qrs = this.bookingDate.qrs.filter((qr: any) => {

        if (qr.type !== 'guest') {
          return true;
        }

        return !(
          qr.createdAt?.seconds === deletedOutcomer.createdAt?.seconds &&
          qr.createdAt?.nanoseconds === deletedOutcomer.createdAt?.nanoseconds
        );

      });

      console.log({
          deletedCount,
          before: this.bookingDate.qrs.length,
          after: qrs.length,
          removed: this.bookingDate.qrs.length - qrs.length
      });

      const visitorCount = Math.max(0, this.bookingDate.VisitorCount - deletedCount);

      const totalVisitors = Math.max(0, this.bookingDate.totalVisitors - deletedCount);

      this._BookingService.updateBooking(this.bookingDate.id, {
        newOutcomers,
        qrs,
        VisitorCount: visitorCount,
        totalVisitors: totalVisitors
      }).subscribe({
        next: (res) => {
          this.bookingDate.newOutcomers = newOutcomers;
          this.bookingDate.qrs = qrs;
          this.bookingDate.VisitorCount = visitorCount;
          this.bookingDate.totalVisitors = totalVisitors;

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
    if (!this.bookingDate?.newOutcomers?.length) {
      return true;
    }

    return this.bookingDate?.newOutcomers?.every((outcomer: any) => !!outcomer.price);
  }
}
