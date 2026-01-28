import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@core/services/event/event.service';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-qrcode',
  imports: [QRCodeComponent],
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.scss'
})
export class QrcodeComponent implements OnInit {
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _EventService = inject(EventService)

  qrValue:string | null = '';

  ngOnInit(): void {
    this.getIPTokent()
  }

  getIPTokent():void{
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.qrValue = params.get('ip')
        this.qrValue = 'https://tikcktat.vercel.app/'
        console.log(this.qrValue);
      }
    })
  }

}
