import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resetuserpassword',
  imports: [ReactiveFormsModule],
  templateUrl: './resetuserpassword.component.html',
  styleUrl: './resetuserpassword.component.scss'
})
export class ResetuserpasswordComponent {
  // private readonly _FormBuilder = inject(FormBuilder)
  // private readonly _AuthService = inject(AuthService)
  // private readonly _ToastrService = inject(ToastrService)
  // private readonly _Router = inject(Router)

  // resetForm:FormGroup = this._FormBuilder.group({
  //   userId: [''],
  //   oldPassword: [''],
  //   newPassword: [''],
  // })

  // submitReset(): void {
  //   let data = this.resetForm.value
  //   data.userId = localStorage.getItem('userId')
  //   console.log(data);
  //   this._AuthService.changePassword(data).subscribe({
  //     next:(res)=>{
  //       this._ToastrService.success(res.msg)
  //       this._Router.navigate(['/home'])
  //     }
  //   })
  // }
}
