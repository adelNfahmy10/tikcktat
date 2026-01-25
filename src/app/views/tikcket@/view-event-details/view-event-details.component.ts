import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-view-event-details',
  imports: [CommonModule],
  templateUrl: './view-event-details.component.html',
  styleUrl: './view-event-details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewEventDetailsComponent {
  allData:any = [
    {
      title: 'Total Graduates',
      amount: '1800 Grad',
      icon: 'ri-graduation-cap-line',
      change: 34.4,
      variant: 'success',
    },
    {
      title: 'Total Companions',
      amount: '750 Comp',
      icon: 'ri-user-line',
      change: 8.5,
      variant: 'danger',
    },
    {
      title: 'Total Tickets',
      amount: '893 Ticket',
      icon: 'ri-ticket-2-line',
      change: 17,
      variant: 'success',
    },
    {
      title: 'Total Event Amount',
      amount: '430,586 EGP',
      icon: 'ri-money-pound-circle-line',
      change: 12,
      variant: 'danger',
    },
  ]
}
