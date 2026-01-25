import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '@core/services/event/event.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-event',
  imports: [CommonModule, RouterLink],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit{
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
          console.log(this.allEvents);
        },
        error: (err) => {
          console.error(err.msg);
        }
      });
  }

}
