import { inject, Injectable } from '@angular/core';
import { collectionData, docData, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private firestore = inject(Firestore);

  // 🔥 Get All Booking
  getAllBookings(): Observable<any[]> {
    const bookingRef = collection(this.firestore, 'bookings');

    return collectionData(bookingRef, { idField: 'id' });
  }

  getBookingById(bookingId: string): Observable<any> {
    const bookingDoc = doc(this.firestore, `bookings/${bookingId}`);

    return docData(bookingDoc, { idField: 'id' });
  }

  // 🔥 Create Booking
  createBooking(data: any) {
    const bookingRef = collection(this.firestore, 'bookings');
    return from(addDoc(bookingRef, data));
  }

  updateBooking(bookingId: string, data: any) {
    const bookingDoc = doc(this.firestore, `bookings/${bookingId}`);
    return from(updateDoc(bookingDoc, data));
  }

  // 🔥 Check User Booking
  checkUserBooking(eventId: string, userId: string) {
    const bookingRef = collection(this.firestore, 'bookings');

    const q = query(
      bookingRef,
      where('EventId', '==', eventId),
      where('userId', '==', userId)
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((bookings: any[]) => bookings.length ? bookings[0] : null)
    );
  }

  getBookingsByEvent(eventId: string) {
    const bookingRef = collection(this.firestore, 'bookings');
    const q = query(
      bookingRef,
      where('EventId', '==', eventId)
    );
    return collectionData(q, { idField: 'id' });
  }

  getUserBookings(userId: string): Observable<any[]> {
    const q = query(
      collection(this.firestore, 'bookings'),
      where('userId', '==', userId)
    );

    return collectionData(q, { idField: 'id' });
  }
}
