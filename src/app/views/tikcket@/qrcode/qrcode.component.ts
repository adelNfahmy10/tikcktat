import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { BookingService } from '@core/services/booking/booking.service';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe, NgClass } from '@angular/common';
import { EventService } from '@core/services/event/event.service';
import { UsersService } from '@core/services/users/users.service';

@Component({
  selector: 'app-qrcode',
  imports: [QRCodeComponent, NgClass, DatePipe],
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.scss'
})
export class QrcodeComponent implements OnInit {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _BookingService = inject(BookingService);
  private readonly _EventService = inject(EventService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)
  private readonly _UsersService = inject(UsersService)

  qrValue: string | null = null;
  booking$!: Observable<any>;
  qrStatus$!: Observable<boolean>;
  eventData:any = {}

  book!:any
  bookMsg:string = ''
  qr!:any
  qrMsg:string = ''
  isUsed!:boolean | string
  qrNotFound:string = ''
  ownerData:any = {}

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        this.qrValue = params.get('ip');

        if (this.qrValue) {
          this.initQrStream(this.qrValue);
        }
      }
    });
  }

  getEventById(id:string):void{
    this._EventService.getEventById(id).subscribe({
      next:(res)=>{
        this.eventData = res
        this.getOwnerById(this.eventData?.OwnerId)
      }
    })
  }

  getOwnerById(id:string):void{
    this._UsersService.getUserById(id).subscribe({
      next:(res)=>{
        this.ownerData = res
      }
    })
  }

  initQrStream(qrId: string) {
    this._NgxSpinnerService.show()
    this._BookingService.getBookingByQrId(qrId).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide()
        this.book = res[0]; // لأنك غالبًا راجع booking واحد

        this.getEventById(this.book.EventId)

        if (!this.book) {
          return;
        }

        this.qr = this.book.qrs?.find((q: any) => q.id === qrId);

        if (!this.qr) {
          return;
        }

        this.isUsed = this.qr.isUsed
      }
    });
  }
}
