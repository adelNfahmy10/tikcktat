import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, where, docData } from '@angular/fire/firestore';
import { doc, increment, updateDoc, writeBatch } from 'firebase/firestore';
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

  // Update Event Data
  updateEvent(eventId: string, data: any) {
    const eventRef = doc(this.firestore, `events/${eventId}`);
    return from(updateDoc(eventRef, data));
  }


  // update OwnerPayment
  updateOwnerPaymentInEvent(eventId: string, amount: number) {
    const eventRef = doc(this.firestore, `events/${eventId}`);

    return from(
      updateDoc(eventRef, {
        ownerPayment: increment(amount)
      })
    );
  }

  // update lastPhase
  updateLastPhase(eventId: string, status: boolean) {
    const eventRef = doc(this.firestore, `events/${eventId}`);

    return from(
      updateDoc(eventRef, {
        lastPhase: status
      })
    );
  }

  // Update Payment Link
  updatePaymentLink(eventId: string, paymentLink: string) {
    const eventRef = doc(this.firestore, `events/${eventId}`);

    return from(
      updateDoc(eventRef, {
        paymentLink: paymentLink
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


  // 🔥 Decrease Event Tickets (بعد إلغاء الحجز)
  decreaseEventTickets(eventId: string, canceledTickets: any): Observable<void> {
    const eventRef = doc(this.firestore, `events/${eventId}`);

    return from(
      updateDoc(eventRef, {
        bookingCount: increment(-canceledTickets),
      })
    );
  }

  // Update QRs SeatNubmer By Departments
  updateAllBookingsQrsWithSeats(bookings: any[]) {
    const batch = writeBatch(this.firestore);

    // Global counters لكل الأقسام
    const deptCounters = new Map<string, number>();

    // حروف الأقسام
    const departments = [
      ...new Set(
        bookings.flatMap(b =>
          (b.qrs || []).map((q: any) => q.department || b.department)
        )
      )
    ].sort();

    const deptMap = new Map<string, string>();

    departments.forEach((dep: any, index) => {
      deptMap.set(dep, String.fromCharCode(65 + index));
    });

    bookings.forEach((booking) => {

      if (!booking.qrs?.length) return;

      const bookingRef = doc(this.firestore, `bookings/${booking.id}`);

      let currentSeat = '';

      const updatedQrs = booking.qrs.map((qr: any) => {

        const dept = qr.department || booking.department;
        const deptLetter = deptMap.get(dept) || 'A';

        if (qr.type === 'owner') {
          const nextIndex = (deptCounters.get(dept) || 0) + 1;

          deptCounters.set(dept, nextIndex);

          currentSeat = `${deptLetter}${nextIndex}`;
        }

        return {
          ...qr,
          seatNumber: qr.type === 'owner'
            ? currentSeat
            : `+${currentSeat}`
        };
      });

      batch.update(bookingRef, {
        qrs: updatedQrs,
        qrsGenerated: true
      });

    });

    return from(batch.commit());
  }

  // Update QRs SeatNubmer By Events
  updateAllBookingsQrsWithSeatsByEvent(bookings: any[]) {

    const batch = writeBatch(this.firestore);

    // Event ID -> Seat Prefix
    const eventLetters = new Map<string, string>([
      ['k2vYgk5ekOaZLp7y3x1U', 'A'],
      ['Nu2hA9IFF5XoAiIDKCKl', 'B'],
      ['6KBIPOyo0rK8A3TVad90', 'C'],
      ['6t29w3KUr793N6eJ93Ih', 'D'],
      ['0fSZiTjFyiz5TL3Bg5xR', 'E']
    ]);

    // Counter لكل Event
    const eventCounters = new Map<string, number>();

    bookings.forEach((booking) => {

      if (!booking.qrs?.length) {
        return;
      }

      // IMPORTANT: EventId بحرف E كبير
      const eventId = booking.EventId;

      const eventLetter = eventLetters.get(eventId);

      if (!eventLetter) {
        console.warn(`No letter assigned for EventId: ${eventId}`);
        return;
      }

      const bookingRef = doc(
        this.firestore,
        `bookings/${booking.id}`
      );

      let currentSeat = '';

      const updatedQrs = booking.qrs.map((qr: any) => {

        if (qr.type === 'owner') {

          const nextIndex =
            (eventCounters.get(eventId) || 0) + 1;

          eventCounters.set(eventId, nextIndex);

          currentSeat = `${eventLetter}${nextIndex}`;
        }

        return {
          ...qr,
          seatNumber: qr.type === 'owner'
            ? currentSeat
            : `+${currentSeat}`
        };

      });

      batch.update(bookingRef, {
        qrs: updatedQrs,
        qrsGenerated: true
      });

    });

    return from(batch.commit());
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
