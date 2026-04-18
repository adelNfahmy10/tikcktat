import { Injectable, inject } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  user$ = authState(this.auth);

  // REGISTER
  register(data: {
    fullName: string;
    fullNameAr: string;
    phone: string;
    role: string;
    email: string;
    password: string;
  }) {
    return from(
      createUserWithEmailAndPassword(
        this.auth,
        data.email,
        data.password
      )
    ).pipe(
      switchMap(async (userCredential) => {
        const user = userCredential.user;

        const userData = {
          uid: user.uid,
          fullName: data.fullName,
          fullNameAr: data.fullNameAr,
          phone: data.phone,
          role: data.role,
          email: data.email,
          createdAt: new Date()
        };

        await setDoc(doc(this.firestore, 'users', user.uid), userData);

        return userData;
      })
    );
  }

  // LOGIN
  login(email: string, password: string) {
    return from(
      signInWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap(async (userCredential) => {

        const uid = userCredential.user.uid;

        const userRef = doc(this.firestore, 'users', uid);
        const userSnap = await getDoc(userRef);

        const userData = userSnap.exists() ? userSnap.data() : null;

        return {
          uid,
          ...userData
        };
      })
    );
  }

  // LOGOUT
  logout() {
    return from(signOut(this.auth));
  }

  // GET USER DATA
  getUserData(uid: string) {
    return from(getDoc(doc(this.firestore, 'users', uid)))
      .pipe(
        switchMap((snap) => {
          return from([snap.exists() ? snap.data() : null]);
        })
      );
  }

  // login(body:any):Observable<any>{
  //   return this._HttpClient.post(` Auth/login`, body)
  // }

  // register(body:any):Observable<any>{
  //   return this._HttpClient.post(` UserManager/RegisterNewUser`, body)
  // }

  // refreshToken(body:any):Observable<any>{
  //   return this._HttpClient.post(` Auth/refresh`, body)
  // }

  // changePassword(body:any):Observable<any>{
  //   return this._HttpClient.post(` Auth/change-password`, body)
  // }

  // addNewPassword(body:any):Observable<any>{
  //   return this._HttpClient.post(` Auth/AddNewPassword`, body)
  // }

  // getAllUsers():Observable<any>{
  //   return this._HttpClient.get(` UserManager/GetAll`)
  // }

  // getUserById(userId:any):Observable<any>{
  //   return this._HttpClient.get(` UserManager/GetById/${userId}`)
  // }

  // deleteUser(userId:any):Observable<any>{
  //   return this._HttpClient.delete(` UserManager/DeleteUser/${userId}`)
  // }

  // updateUser(userId:any, body:any):Observable<any>{
  //   return this._HttpClient.put(` UserManager/Update?id=${userId}`, body)
  // }

  // updateUserRole(body:any):Observable<any>{
  //   return this._HttpClient.put(` UserManager/UpdateUserRoles`, body)
  // }

  // swichActiveUser(userId:any):Observable<any>{
  //   return this._HttpClient.post(` UserManager/SwitchUserActive/${userId}`, {})
  // }

}
