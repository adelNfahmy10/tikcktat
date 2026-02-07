import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@core/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _HttpClient = inject(HttpClient)

  login(body:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}Auth/login`, body)
  }

  register(body:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}UserManager/RegisterNewUser`, body)
  }

  refreshToken(body:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}Auth/refresh`, body)
  }

  changePassword(body:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}Auth/change-password`, body)
  }

  addNewPassword(body:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}Auth/AddNewPassword`, body)
  }

  getAllUsers():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}UserManager/GetAll`)
  }

  getUserById(userId:any):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}UserManager/GetById/${userId}`)
  }

  deleteUser(userId:any):Observable<any>{
    return this._HttpClient.delete(`${environment.baseUrl}UserManager/DeleteUser/${userId}`)
  }

  updateUser(userId:any, body:any):Observable<any>{
    return this._HttpClient.put(`${environment.baseUrl}UserManager/Update?id=${userId}`, body)
  }

  updateUserRole(body:any):Observable<any>{
    return this._HttpClient.put(`${environment.baseUrl}UserManager/UpdateUserRoles`, body)
  }

  swichActiveUser(userId:any):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}UserManager/SwitchUserActive/${userId}`, {})
  }

}
