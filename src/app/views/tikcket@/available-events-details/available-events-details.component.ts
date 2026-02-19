import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '@core/services/event/event.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-available-events-details',
  imports: [CommonModule, NgbAccordionModule, RouterLink],
  templateUrl: './available-events-details.component.html',
  styleUrl: './available-events-details.component.scss'
})
export class AvailableEventsDetailsComponent {
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
