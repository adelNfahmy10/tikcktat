import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@core/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly _HttpClient = inject(HttpClient)

  // Get All Event ((Admin))
  getAllAdminEvents():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}Events/GetAllEvents`)
  }

  // Get All Event ((Public))
  getAllEvents(eventType?:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}Events/GetAllEvents?type=${eventType}`)
  }

  // Get Event By Id
  getEventById(id:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}Events/GetEventById/${id}`)
  }

  // Get Event Attendees
  getEventAttendees(eventId:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}Events/${eventId}/attendees`)
  }

  // Get All Owners
  getAllEventsOwner():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}Events/GetAllEventOwners`)
  }

  // Get Event By Owner
  GetEventsByOwner(userId:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}Events/GetEventsByOwner/${userId}`)
  }

  // Create Event
  createEvent(body:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}Events/CreateNewEvent`, body)
  }

  // Update Event
  updateEvent(body:any):Observable<any>{
    return this._HttpClient.put(`${environment.baseUrl}Events/UpdateEvent`, body)
  }

  // Delete Event
  deleteEvent(id:any):Observable<any>{
    return this._HttpClient.delete(`${environment.baseUrl}Events/DeleteEvent/${id}`)
  }

  // Assign Owner To Event
  assignOwnerToEvent(body:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}Events/AssignEventToOwner`, body)
  }

  // Checkout To Event
  checkoutEvent(body:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}Bookings/event-checkout`, body)
  }

  // Get User Checkout
  getUserCheckout():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}Checkout/my-checkouts`)
  }

  // ########################### Download Excel Sheets ###########################
  downloadAllEventOwners():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}Events/GetAllEventOwners/download-excel`, {
      responseType: 'blob'
    })
  }

  downloadGetAllEvents():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}Events/GetAllEvents/download-excel`, {
      responseType: 'blob'
    })
  }

  downloadEventAttendees(eventId:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}Events/${eventId}/attendees/download-excel`, {
      responseType: 'blob'
    })
  }

  downloadEventsByOwner(userId:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}Events/GetEventsByOwner/download-excel/${userId}`, {
      responseType: 'blob'
    })
  }
}
