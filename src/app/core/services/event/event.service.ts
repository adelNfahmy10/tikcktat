import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, where, docData } from '@angular/fire/firestore';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private firestore = inject(Firestore);

  // 🔥 Add Event
  createEvent(event: any) {
    const eventsRef = collection(this.firestore, 'events');

    return from(addDoc(eventsRef, event));
  }

  updateOwnerPaymentInEvent(eventId: string, amount: number) {
    const eventRef = doc(this.firestore, `events/${eventId}`);

    return from(
      updateDoc(eventRef, {
        ownerPayment: increment(amount)
      })
    );
  }

  // 🔥 Update Event Tickets (بعد الحجز)
  updateEventTickets(eventId: string, bookedTickets: number) {
    const eventRef = doc(this.firestore, `events/${eventId}`);

    return from(
      updateDoc(eventRef, {
        bookingCount: increment(bookedTickets),
      })
    );
  }

  // 🔥 Get all events
  getAllEvents(): Observable<any[]> {
    const eventsRef = collection(this.firestore, 'events');

    return collectionData(eventsRef, { idField: 'id' });
  }

  // 🔥 Get event by ID
  getEventById(id: string): Observable<any> {

    const eventDocRef = doc(this.firestore, `events/${id}`);

    return docData(eventDocRef, { idField: 'id' });
  }

  // 🔥 Get events By Type
  getEventsByType(type: string) {
    const eventsRef = collection(this.firestore, 'events');

    const q = query(
      eventsRef,
      where('Type', '==', type)
    );

    return collectionData(q, { idField: 'id' });
  }

  // 🔥 Get events by owner
  getEventsByOwner(ownerId: string): Observable<any[]> {
    const eventsRef = collection(this.firestore, 'events');

    const q = query(
      eventsRef,
      where('OwnerId', '==', ownerId)
    );

    return collectionData(q, { idField: 'id' });
  }

  // 🔥 Upload Image Urls
  uploadImage(file: File): Promise<string> {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', 'ticketat_upload');

    return fetch(
      'https://api.cloudinary.com/v1_1/ticketat/image/upload',
      {
        method: 'POST',
        body: formData
      }
    )
      .then(res => res.json())
      .then(data => data.secure_url);
  }


  // private readonly _HttpClient = inject(HttpClient)

  // // Get All Event ((Admin))
  // getAllAdminEvents():Observable<any>{
  //   return this._HttpClient.get(` Events/GetAllEvents`)
  // }

  // // Get All Event ((Public))
  // getAllEvents(eventType?:any):Observable<any>{
  //   return this._HttpClient.get(` Events/GetAllEvents?type=${eventType}`)
  // }

  // // Get Event By Id
  // getEventById(id:any):Observable<any>{
  //   return this._HttpClient.get(` Events/GetEventById/${id}`)
  // }

  // // Get Event Attendees
  // getEventAttendees(eventId:any):Observable<any>{
  //   return this._HttpClient.get(` Events/${eventId}/attendees`)
  // }

  // // Get All Owners
  // getAllEventsOwner():Observable<any>{
  //   return this._HttpClient.get(` Events/GetAllEventOwners`)
  // }

  // // Get Event By Owner
  // GetEventsByOwner(userId:any):Observable<any>{
  //   return this._HttpClient.get(` Events/GetEventsByOwner/${userId}`)
  // }

  // // Create Event
  // createEvent(body:any):Observable<any>{
  //   return this._HttpClient.post(` Events/CreateNewEvent`, body)
  // }

  // // Update Event
  // updateEvent(body:any):Observable<any>{
  //   return this._HttpClient.put(` Events/UpdateEvent`, body)
  // }

  // // Delete Event
  // deleteEvent(id:any):Observable<any>{
  //   return this._HttpClient.delete(` Events/DeleteEvent/${id}`)
  // }

  // // Assign Owner To Event
  // assignOwnerToEvent(body:any):Observable<any>{
  //   return this._HttpClient.post(` Events/AssignEventToOwner`, body)
  // }

  // // Checkout To Event
  // checkoutEvent(body:any):Observable<any>{
  //   return this._HttpClient.post(` Bookings/event-checkout`, body)
  // }

  // // Get User Checkout
  // getUserCheckout():Observable<any>{
  //   return this._HttpClient.get(` Checkout/my-checkouts`)
  // }

  // // ########################### Download Excel Sheets ###########################
  // downloadAllEventOwners():Observable<any>{
  //   return this._HttpClient.get(` Events/GetAllEventOwners/download-excel`, {
  //     responseType: 'blob'
  //   })
  // }

  // downloadGetAllEvents():Observable<any>{
  //   return this._HttpClient.get(` Events/GetAllEvents/download-excel`, {
  //     responseType: 'blob'
  //   })
  // }

  // downloadEventAttendees(eventId:any):Observable<any>{
  //   return this._HttpClient.get(` Events/${eventId}/attendees/download-excel`, {
  //     responseType: 'blob'
  //   })
  // }

  // downloadEventsByOwner(userId:any):Observable<any>{
  //   return this._HttpClient.get(` Events/GetEventsByOwner/download-excel/${userId}`, {
  //     responseType: 'blob'
  //   })
  // }
}
