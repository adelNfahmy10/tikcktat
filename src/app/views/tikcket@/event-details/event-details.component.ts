import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { EventService } from '@core/services/event/event.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-event-details',
  imports: [CommonModule, NgbAccordionModule, RouterLink],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent implements OnInit{
  private readonly _EventService = inject(EventService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)

  eventData:any
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
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
  
  get eventDetailsList(): string[] {
    if (!this.eventData?.eventDetails) return [];
    return this.eventData.eventDetails
      .split('\r\n')          // نفصل كل سطر
      .map((item:any) => item.trim()) // نشيل أي فراغات
      .filter((item:any) => item);    // نشيل أي عناصر فاضية
  }

get termsList(): string[] {
  if (!this.eventData?.termsOfEntries) return [];
  return this.eventData.termsOfEntries
    .split('\r\n')          // نفصل كل شرط على سطر
    .map((item:any) => item.trim()) // نشيل أي فراغات
    .filter((item:any) => item);    // نشيل أي عناصر فاضية
}
}
