import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { SendmailService } from '@core/services/send-email/sendmail.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  role:string | null = localStorage.getItem('role')
  token:string | null = localStorage.getItem('token')

  private readonly _SendmailService = inject(SendmailService)
  private readonly _ToastrService = inject(ToastrService)

  sendConfirmEmail():void{
    let data = {
      to: 'adelnasserfahmy@gmail.com',
      userName: 'Adel Dola',
      eventName: 'New Event Testing'
    }

    this._SendmailService.sendConfirmBooking(data).subscribe({
      next: (res) => {
        this._ToastrService.success('Email Sent');
      },
      error: (err) => {
        this._ToastrService.warning('Email failed !');
      }
    });
  }
}
