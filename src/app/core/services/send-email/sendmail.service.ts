import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendmailService {
  private readonly _HttpClient = inject(HttpClient)

  sendMail(body:any): Observable<any> {
    return this._HttpClient.post(
      'https://ticketat-send-email.vercel.app/api/send-email',
      body,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  sendOTP(body:any): Observable<any> {
    return this._HttpClient.post(
      'https://ticketat-send-email.vercel.app/api/send-otp',
      body,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  sendConfiranceEmail(body:any): Observable<any> {
    return this._HttpClient.post(
      'https://ticketat-send-email.vercel.app/api/send-confirance-email',
      body,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
