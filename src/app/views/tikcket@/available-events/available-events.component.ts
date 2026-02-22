import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '@core/services/event/event.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-available-events',
  imports: [CommonModule, RouterLink],
  templateUrl: './available-events.component.html',
  styleUrl: './available-events.component.scss'
})
export class AvailableEventsComponent {
  private readonly _EventService = inject(EventService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)

  allEvents:any[] = []
  type:string | null = ''
  token:string | null = localStorage.getItem('token')

  ngOnInit(): void {
    this.getEvents()
  }

  getEvents(): void {
    this._ActivatedRoute.paramMap.pipe(
        switchMap(params => {
          this.type = params.get('type');
          return this._EventService.getAllEvents(this.type);
        })
      )
      .subscribe({
        next: (res) => {
          this.allEvents = res.data;
        },
        error: (err) => {
          console.error(err.msg);
        }
      });
  }

}
