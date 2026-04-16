import { CommonModule, DatePipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '@core/services/booking/booking.service';
import { EventService } from '@core/services/event/event.service';
import { UsersService } from '@core/services/users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-organizer-event-details',
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './organizer-event-details.component.html',
  styleUrl: './organizer-event-details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrganizerEventDetailsComponent {
  private readonly _UsersService = inject(UsersService)
  private readonly _EventService = inject(EventService)
  private readonly _BookingService = inject(BookingService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)

  eventData:any
  eventId:string = ''

  ownerId:string = ''
  ownerData:any = {}

  allBooking:any[] = []
  totalTickets:number = 0
  totalCompanions:number = 0
  totalRevenue:number = 0

  ngOnInit(): void {
    this.getEventById()
    this.getAllBooking()
  }

  getEventById(): void {
    this._NgxSpinnerService.show()
    this._ActivatedRoute.paramMap
      .pipe(
        switchMap(params => {
          this.eventId = params.get('id')!;
          return this._EventService.getEventById(this.eventId);
        }),
      )
      .subscribe({
        next: (res) => {
        this._NgxSpinnerService.hide()
          this.eventData = res;
          this.getOwnerById()
        },
        error: (err) => {
          this._NgxSpinnerService.hide()
          console.error(err);
        }
      });
  }

  getAllBooking(){
    this._NgxSpinnerService.show()

    this._BookingService.getBookingsByEvent(this.eventId).subscribe({
      next:(res)=>{
        this._NgxSpinnerService.hide()
        this.allBooking = res
        this.totalTickets = this.allBooking.length

        // 👨‍👩‍👧 total companions
        this.totalCompanions = this.allBooking.reduce((sum, b) => {
          return sum + (b.VisitorCount + b.defaultVisitorCount || 0);
        }, 0);

        // 💰 total revenue
        const ticketPrice = this.eventData?.TicketPrice || 0;
        const visitorPrice = this.eventData?.VisitorPrice || 0;

        this.totalRevenue = this.allBooking.reduce((sum, b) => {
          const companions = b.VisitorCount || 0;
          const subtotal = ticketPrice + (companions * visitorPrice);
          return sum + subtotal;
        }, 0);
      },
      error:(err)=>[
        this._NgxSpinnerService.hide()
      ]
    })
  }

  getOwnerById():void{
    this._NgxSpinnerService.show()
    let ownerId = this.eventData?.OwnerId
    this._UsersService.getUserById(ownerId).subscribe({
      next:(res)=>{
        this._NgxSpinnerService.hide()
        this.ownerData = res
      },
      error:(err)=>[
        this._NgxSpinnerService.hide()
      ]
    })
  }

  get eventDetailsList(): string[] {
    if (!this.eventData?.EventDetails) return [];
    return this.eventData.EventDetails
      .split('\r\n')          // نفصل كل سطر
      .map((item:any) => item.trim()) // نشيل أي فراغات
      .filter((item:any) => item);    // نشيل أي عناصر فاضية
  }

  get termsList(): string[] {
    if (!this.eventData?.TermsOfEntries) return [];
    return this.eventData.TermsOfEntries
      .split('\r\n')          // نفصل كل شرط على سطر
      .map((item:any) => item.trim()) // نشيل أي فراغات
      .filter((item:any) => item);    // نشيل أي عناصر فاضية
  }
}
