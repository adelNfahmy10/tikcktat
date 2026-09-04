import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService } from '@core/services/event/event.service';
import { UsersService } from '@core/services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin-view-event',
  imports: [FormsModule, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './admin-view-event.component.html',
  styleUrl: './admin-view-event.component.scss'
})
export class AdminViewEventComponent{
  private readonly _EventService = inject(EventService)
  private readonly _UsersService = inject(UsersService)
  private readonly _ToastrService = inject(ToastrService)

  allEvents:any[] = []
  allOwners: any[] = [];
  eventsWithOwnerName: any[] = [];

  // table state
  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  page = 1;
  pageSize = 15;
  totalPages: number[] = [];

  filteredData:any[] = [];
  paginatedData: any[] = [];

  ngOnInit() {
    this.getAllOwners()
    this.getAllEvent()
  }

  getAllEvent(): void {
    this._EventService.getAllEvents().subscribe({
      next: (res) => {
        this.allEvents = res;

        console.log(this.allEvents);

        this.mergeData(); // مهم

        this.filteredData = [...this.eventsWithOwnerName]; // 👈 مهم جدًا
        this.updatePagination();
      }
    });
  }

  getAllOwners(): void {
    this._UsersService.getOwners().subscribe(res => {
      this.allOwners = res;

      this.mergeData();

      this.filteredData = [...this.eventsWithOwnerName];
      this.updatePagination();
    });
  }

  mergeData(): void {
    if (!this.allEvents.length || !this.allOwners.length) return;

    this.eventsWithOwnerName = this.allEvents.map(event => {

      const owner = this.allOwners.find(o => o.uid === event.OwnerId);

      return {
        ...event,
        ownerName: owner?.fullName || 'Unknown'
      };
    });
  }

  changeEventStatus(event: any): void {
    const eventId = event?.id
    const newStatus = event?.status === 'Active' ? 'Inactive' : 'Active';

    this._EventService.updateEvent(eventId, {
      status: newStatus
    }).subscribe({
      next: () => {
        event.status = newStatus; // تحديث الـ UI
        this._ToastrService.success('Event status updated successfully')
      },
      error: (err) => {
        console.error(err);
        this._ToastrService.error(err)
      }
    });
  }

  paymentLink: string = '';
  ownerPaymentInEvent:any = {}
  amountPayment:number = 0
  eventId:string = ''

  getEventById(id:string):void{
    this.eventId = id
    this._EventService.getEventById(id)
    .pipe(
      map((res: any) => {
        return {
          eventName: res.EventName,
          ownerPayment: res.ownerPayment
        };
      })
    )
    .subscribe({
      next: (res) => {
        this.ownerPaymentInEvent = res
      }
    });
  }

  updateOwnerPayment():void{
    this._EventService.updateOwnerPaymentInEvent(this.eventId, this.amountPayment).subscribe({
      next:(res)=>{
        this._ToastrService.success('Payment has been added successfully');
        this.ownerPaymentInEvent = {}
        this.amountPayment = 0
        this.eventId = ''
      }
    })
  }

  updateLastPhase(eventId: string, currentStatus: boolean): void {
    const status = !currentStatus;

    this._EventService.updateLastPhase(eventId, status).subscribe({
      next: () => {
        this._ToastrService.success('Last Phase Updated Successfully - ' + `'${status}'`);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updatePaymentLink(): void {
    this._EventService.updatePaymentLink(this.eventId, this.paymentLink).subscribe({
      next: (res) => {
        console.log(res);
        this.getAllOwners()
        this._ToastrService.success('Payment Link Updated Successfully');
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // 🔍 Search
  applySearch() {
    this.filteredData = this.eventsWithOwnerName.filter(item =>
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

  downloadAllEvents(): void {

  if (!this.eventsWithOwnerName.length) return;

  // نخلي الداتا clean للـ Excel
  const exportData = this.eventsWithOwnerName.map(event => ({
    'Event Name': event.EventName,
    'Owner Name': event.ownerName,
    'Location Name': event.LocationName,
    'Location Link': event.Location,
    'Date': event.Date,
    'Ticket Price': event.TicketPrice,
    'Visitor Price': event.VisitorPrice,
    'Ticket Count': event.TicketCount,
    'Status': event.status
  }));

  // create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // create workbook
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Events');

  // download file
  XLSX.writeFile(workbook, 'all-events.xlsx');
}

}
