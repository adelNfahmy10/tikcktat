import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private firestore = inject(Firestore);

  // 🔥 Create Booking
  createBooking(data: any) {
    const bookingRef = collection(this.firestore, 'bookings');
    return from(addDoc(bookingRef, data));
  }

  // 🔥 Check User Booking
  checkUserBooking(eventId: string, userId: string) {
    const bookingRef = collection(this.firestore, 'bookings');
    const q = query(
      bookingRef,
      where('EventId', '==', eventId),
      where('userId', '==', userId)
    );

    return getDocs(q);
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
