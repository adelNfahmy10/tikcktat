import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { BookingService } from '@core/services/booking/booking.service';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-qrcode',
  imports: [QRCodeComponent],
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.scss'
})
export class QrcodeComponent implements OnInit {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _BookingService = inject(BookingService);
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)

  qrValue: string | null = null;
  booking$!: Observable<any>;
  qrStatus$!: Observable<boolean>;

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

  book!:any
  bookMsg:string = ''
  qr!:any
  qrMsg:string = ''
  isUsed!:boolean | string
  qrNotFound:string = ''

  initQrStream(qrId: string) {
    this._NgxSpinnerService.show()
    this._BookingService.getBookingByQrId(qrId).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide()
        this.book = res[0]; // لأنك غالبًا راجع booking واحد

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
