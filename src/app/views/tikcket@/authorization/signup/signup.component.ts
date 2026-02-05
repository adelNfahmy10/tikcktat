import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { RoleService } from '@core/services/role/role.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{
  private readonly _AuthService = inject(AuthService)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _RoleService = inject(RoleService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _Router = inject(Router)

  allRoles:any[] = []

  ngOnInit(): void {
    this.getAllRoles()
  }

  registerForm:FormGroup = this._FormBuilder.group({
    fullName:[null],
    email:[null],
    mobile:[null],
    password:[null],
    roleId:[null],
  })

  getAllRoles():void{
    this._RoleService.getAllRoles().subscribe({
      next:(res)=>{
        this.allRoles = res.data
      }
    })
  }

  submitRegisterForm():void{
    let data = this.registerForm.value

    this._AuthService.register(data).subscribe({
      next:(res)=>{
        this._ToastrService.success('Create Account Is Successfully')
        this.registerForm.reset()
        this._Router.navigate(['/login'])
      },
      error:(err)=>{
        this._ToastrService.error('Faild')
      }
    })
  }
}
