import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '@core/services/booking/booking.service';
import { EventService } from '@core/services/event/event.service';
import { UsersService } from '@core/services/users/users.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-organizer-event-attendees',
  imports: [FormsModule, CommonModule],
  templateUrl: './organizer-event-attendees.component.html',
  styleUrl: './organizer-event-attendees.component.scss'
})
export class OrganizerEventAttendeesComponent {
  private readonly _EventService = inject(EventService)
  private readonly _UsersService = inject(UsersService);
  private readonly _BookingService = inject(BookingService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)

  eventId:string | null = null
  eventData: any = {};

  allUsers: any[] = [];
  allBooking: any[] = [];
  attendeesWithUsers: any[] = [];

  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  page = 1;
  pageSize = 15;
  totalPages: number[] = [];

  filteredData:any[] = [];
  paginatedData: any[] = [];

  tax:number = 0.02

  ngOnInit() {
    this.getAttendeesByEventId()
    this.getEventById()
    this.getAllUsers()
    this.buildAttendees()
  }

  getEventById(): void {
    this._EventService.getEventById(this.eventId!).subscribe({
      next: (res) => {
        this.eventData = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getAllUsers(): void {
    this._UsersService.getAllUsers().subscribe({
      next: (res) => {
        this.allUsers = res;
        this.mergeData(); // 🔥 مهم
      }
    });
  }

  getAttendeesByEventId(): void {
    this._ActivatedRoute.paramMap
      .pipe(
        switchMap(params => {
          this.eventId = params.get('eventId');
          return this._BookingService.getBookingsByEvent(this.eventId!);
        })
      )
      .subscribe({
        next: (res) => {
          this.allBooking = res;
          this.mergeData(); // 🔥 مهم
        }
      });
  }

  mergeData(): void {
    if (!this.allBooking.length || !this.allUsers.length) return;

    const usersMap = new Map(
      this.allUsers.map(u => [u.uid, u])
    );

    this.attendeesWithUsers = this.allBooking.map(b => {

      const user = usersMap.get(b.userId);

      return {
        ...b,
        userName: user?.fullName || 'Unknown',
        userEmail: user?.email || '',
        userPhone: user?.phone || ''
      };
    });

    this.filteredData = [...this.attendeesWithUsers];

    this.updatePagination();
  }

  buildAttendees(): void {
    const usersMap = new Map(
      this.allUsers.map(u => [u.uid, u])
    );

    this.attendeesWithUsers = this.allBooking.map(b => {

      const user = usersMap.get(b.userId);

      const companions = b.VisitorCount || 0;

      const ticketPrice = this.eventData?.TicketPrice || 0;
      const visitorPrice = this.eventData?.VisitorPrice || 0;

      const totalPrice =
        ticketPrice + (companions * visitorPrice);

      return {
        id: b.id,
        fullName: user?.fullName || 'Unknown',
        phone: user?.phone || '-',
        email: user?.email || '-',
        photoUrl: user?.photoUrl || 'assets/default.png',

        companions,
        totalPrice,

        attendance: b.attendance || 'Pending',
        status: b.status || 'Pending'
      };
    });

    this.filteredData = [...this.attendeesWithUsers];
    this.updatePagination();
  }


  taxAmount:number = 0
  getTotal(user: any): number {
    const subtotal = (user.VisitorCount * this.eventData.VisitorPrice) + this.eventData.TicketPrice;

    this.taxAmount = subtotal * this.tax;


    // return subtotal + this.taxAmount;
    return subtotal;
  }

  // 🔍 Search
  applySearch() {
    this.filteredData = this.attendeesWithUsers.filter(item =>
      Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );

    this.page = 1;
    this.updatePagination();
  }

  // 🔃 Sort (supports boolean active)
  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a: any, b: any) => {
      let valueA = a[column];
      let valueB = b[column];

      if (typeof valueA === 'boolean') {
        valueA = valueA ? 1 : 0;
        valueB = valueB ? 1 : 0;
      }

      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;

      return 0;
    });

    this.updatePagination();
  }

  // 📄 Pagination
  updatePagination() {

    const total = Math.ceil(this.filteredData.length / this.pageSize);

    this.totalPages = Array.from({ length: total }, (_, i) => i + 1);

    if (this.page > total) this.page = total || 1;
    if (this.page < 1) this.page = 1;

    const start = (this.page - 1) * this.pageSize;

    this.paginatedData = this.filteredData.slice(start, start + this.pageSize);
  }

  changePage(p: number) {
    if (p < 1 || p > this.totalPages.length) return;
    this.page = p;
    this.updatePagination();
  }
}
