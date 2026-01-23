import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LogoBoxComponent } from '@component/logo-box.component';
import { AuthService } from '@core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, LogoBoxComponent, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  private readonly _AuthService = inject(AuthService)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _Router = inject(Router)

  registerForm:FormGroup = this._FormBuilder.group({
    fullName:[null],
    email:[null],
    mobile:[null],
    password:[null]
  })

  submitRegisterForm():void{
    let data = this.registerForm.value
    this._AuthService.register(data).subscribe({
      next:(res)=>{
        this._ToastrService.success('Create Account Is Successfully')
        this.registerForm.reset()
        this._Router.navigate(['/login'])
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
