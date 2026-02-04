import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '@core/services/event/event.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-view-event-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './view-event-details.component.html',
  styleUrl: './view-event-details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewEventDetailsComponent {
  private readonly _EventService = inject(EventService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)

  eventData:any = {}
  eventId:string | null = null

  ngOnInit(): void {
    this.getEventById()
  }

  getEventById(): void {
    this._ActivatedRoute.paramMap
      .pipe(
        switchMap(params => {
          this.eventId = params.get('id');
          return this._EventService.getEventById(this.eventId);
        })
      )
      .subscribe({
        next: (res) => {
          this.eventData = res.data;
          console.log(this.eventData);

        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  allData:any = [
    {
      title: '',
      amount: ` `,
      icon: '',
      change: 34.4,
      variant: 'success',
    },
    {
      title: '',
      amount: '750 Comp',
      icon: '',
      change: 8.5,
      variant: 'danger',
    },
    {
      title: '',
      amount: '893 Ticket',
      icon: '',
      change: 17,
      variant: 'success',
    },
    {
      title: '',
      amount: '430,586 EGP',
      icon: '',
      change: 12,
      variant: 'danger',
    },
  ]



}
