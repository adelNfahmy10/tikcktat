import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@core/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly _HttpClient = inject(HttpClient)

  createEvent(body:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}Events/CreateNewEvent`, body)
  }

  getAllEvents(eventType:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}Events/GetAllEvents?type=${eventType}`)
  }

  getEventById(id:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}Events/GetEventById/${id}`)
  }

  checkoutEvent(body:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}Events/Checkout`, body)
  }
}
