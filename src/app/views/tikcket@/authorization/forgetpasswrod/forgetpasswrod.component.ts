import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgetpasswrod',
  imports: [ReactiveFormsModule],
  templateUrl: './forgetpasswrod.component.html',
  styleUrl: './forgetpasswrod.component.scss'
})
export class ForgetpasswrodComponent {
//   private readonly _FormBuilder = inject(FormBuilder)
//   private readonly _AuthService = inject(AuthService)
//   private readonly _ToastrService = inject(ToastrService)
//   private readonly _Router = inject(Router)

//   forgetPassword:FormGroup = this._FormBuilder.group({
//     mobile: [''],
//     code: [''],
//     password: [''],
//   })

//   step:number = 1

//   changeStep():void{
//     if(!this.forgetPassword.get('mobile')?.value){
//       this._ToastrService.error('Please enter your phone number')
//       this.step = 1;
//       return
//     } else {
//       this.step += 1;
//     }

//     if( !this.forgetPassword.get('code')?.value ){
//       this._ToastrService.error('Please enter code')
//       this.step = 2;
//       return
//     } else {
//       this.step += 1;
//     }
// }

//   submitForgetPassword(): void {
//     let data = this.forgetPassword.value
//     console.log(data);
//     // this._AuthService.changePassword(data).subscribe({
//     //   next:(res)=>{
//     //     this._ToastrService.success(res.msg)
//     //     this._Router.navigate(['/home'])
//     //   }
//     // })
//   }
}
