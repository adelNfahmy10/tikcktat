import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@core/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly _HttpClient = inject(HttpClient)

  paymobInitiate(body:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}Payments/paymob/initiate`, body)
  }

  paymentsStatus(ticketId:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}Payments/${ticketId}/status?referenceType=Ticket`)
  }

  paymobWebhooks(body:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}webhooks/paymob`, body)
  }

}
