import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LogoBoxComponent } from '@component/logo-box.component';
import { AuthService } from '@core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _AuthService = inject(AuthService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _Router = inject(Router)

  loginForm:FormGroup = this._FormBuilder.group({
    username:[null,[Validators.required,Validators.email]],
    password:[null,[Validators.required,Validators.minLength(6)]],
  })

  submitLogin():void{
    let data = this.loginForm.value
    console.log(data);
    this._AuthService.login(data).subscribe({
      next:(res)=>{
        localStorage.setItem('token', res.data.accessToken)
        localStorage.setItem('refreshToken', res.data.refreshToken)
        localStorage.setItem('userId', res.data.userId)
        localStorage.setItem('fullName', res.data.fullName)
        localStorage.setItem('role', res.data.roles[0])
        this._ToastrService.success('Login Successfully..!')
        this._Router.navigate(['/home']).then(() => {
          window.location.reload();
        });
      }
    })
  }
}
