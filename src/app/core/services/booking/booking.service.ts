import { inject, Injectable } from '@angular/core';
import { collectionData, docData, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private firestore = inject(Firestore);

  // Get All Booking
  getAllBookings(): Observable<any[]> {
    const bookingRef = collection(this.firestore, 'bookings');

    return collectionData(bookingRef, { idField: 'id' });
  }

  // Get Booking By Id
  getBookingById(bookingId: string): Observable<any> {
    const bookingDoc = doc(this.firestore, `bookings/${bookingId}`);

    return docData(bookingDoc, { idField: 'id' });
  }

  // Get Booking By QrId
  getBookingByQrId(qrId: string): Observable<any> {
    return collectionData(
      collection(this.firestore, 'bookings'),
      { idField: 'id' }
    ).pipe(
      map((bookings: any[]) =>
        bookings.filter(b =>
          b.qrs?.some((q: any) => q.id === qrId)
        )
      )
    );
  }

  // Get Event Bookings
  getBookingsByEvent(eventId: string) {
    const bookingRef = collection(this.firestore, 'bookings');
    const q = query(
      bookingRef,
      where('EventId', '==', eventId)
    );
    return collectionData(q, { idField: 'id' });
  }

  // Get User Bookings
  getUserBookings(userId: string): Observable<any[]> {
    const q = query(
      collection(this.firestore, 'bookings'),
      where('userId', '==', userId)
    );

    return collectionData(q, { idField: 'id' });
  }

  // Create Booking
  createBooking(data: any) {
    const bookingRef = collection(this.firestore, 'bookings');
    return from(addDoc(bookingRef, data));
  }

  // Update Booking By Id
  updateBooking(bookingId: string, data: any) {
    const bookingDoc = doc(this.firestore, `bookings/${bookingId}`);
    return from(updateDoc(bookingDoc, data));
  }

  // Check User Booking
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

  // Delete Booking
  deleteBooking(bookingId: string): Observable<void> {
    const bookingRef = doc(this.firestore, 'bookings', bookingId);
    return from(deleteDoc(bookingRef));
  }

}
