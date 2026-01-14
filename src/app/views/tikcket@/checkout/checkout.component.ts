import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private readonly _FormBuilder = inject(FormBuilder)

  checkoutForm:FormGroup = this._FormBuilder.group({
    photo:[null],
    fullName:[null],
    phone:[null],
    email:[null],
    visitor:[null],
  })

  submitCheckout():void{
    let data = this.checkoutForm.value
    console.log(data);
  }


}
