import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@core/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly _HttpClient = inject(HttpClient)

  getAllRoles():Observable<any>{
    return this._HttpClient.get(` Roles/GetAllRoles`)
  }

  createRoles(body:any):Observable<any>{
    return this._HttpClient.post(` Roles/AddNewRole`, body)
  }

  deleteRoles(roleName:any):Observable<any>{
    return this._HttpClient.delete(` Roles/DeleteRole/roleName?roleName=${roleName}`)
  }
}
