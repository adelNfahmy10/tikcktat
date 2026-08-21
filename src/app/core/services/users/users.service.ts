import { Injectable, inject } from '@angular/core';
import { Firestore, collection, docData, query, where } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { deleteDoc, doc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private firestore = inject(Firestore);

  getAllUsers(): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'uid' });
  }

  getOwners(): Observable<any[]> {

    const usersRef = collection(this.firestore, 'users');

    const ownersQuery = query(
      usersRef,
      where('role', '==', 'Owner')
    );

    return collectionData(ownersQuery, { idField: 'uid' });
  }

  getUserById(id: string): Observable<any> {

    const userRef = doc(this.firestore, `users/${id}`);

    return docData(userRef, { idField: 'uid' });
  }

  deleteUser(uid: string): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return deleteDoc(userRef);
  }
}
