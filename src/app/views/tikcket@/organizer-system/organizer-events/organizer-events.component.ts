import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService } from '@core/services/event/event.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-organizer-events',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './organizer-events.component.html',
  styleUrl: './organizer-events.component.scss'
})
export class OrganizerEventsComponent {
  private readonly _EventService = inject(EventService)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)

  userId:string | null = localStorage.getItem('userId')
  fullName:string | null = localStorage.getItem('fullName')
  ownerEvents:any[] = []

  bookingCount:number = 0

  // table state
  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  page = 1;
  pageSize = 15;
  totalPages: number[] = [];
  filteredData:any[] = [];
  paginatedData: any[] = [];


  ngOnInit(){
    this.getOwnerEvents()
  }

  getOwnerEvents():void {
    this._NgxSpinnerService.show()
    const userId = localStorage.getItem('userId');
    if (userId) {
      this._EventService.getEventsByOwner(userId).subscribe({
        next: (res) => {
          this._NgxSpinnerService.hide()
          this.ownerEvents = res;
          console.log(this.ownerEvents);

          this.filteredData = [...this.ownerEvents];
          this.updatePagination();
        },
        error: (err) => {
          this._NgxSpinnerService.hide()
          console.error('Error fetching owner events:', err);
        }
      });
    }
  }

  downloadOwnerEvent(): void {
    if (!this.ownerEvents || this.ownerEvents.length === 0) return;

    const exportData = this.ownerEvents.map((event: any) => ({
      Event_Name: event.EventName,
      Type: event.Type,
      Organizer: event.OriganizerName,
      Location_Name: event.LocationName,
      Location_Link: event.Location,
      Date: event.Date,
      Status: event.status,

      Ticket_Price: event.TicketPrice,
      Visitor_Price: event.VisitorPrice,
      Ticket_Count: event.TicketCount,

      Payment_Link: event.PaymentLink,

      Event_Details: event.EventDetails,
      Terms_Of_Entries: event.TermsOfEntries,

      Created_At: event.createdAt
        ? new Date(event.createdAt.seconds * 1000).toLocaleString()
        : '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // تحسين عرض الأعمدة (اختياري بس مهم)
    worksheet['!cols'] = [
      { wch: 40 }, // Event_Name
      { wch: 15 }, // Type
      { wch: 20 }, // Organizer
      { wch: 25 }, // Location_Name
      { wch: 40 }, // Location_Link
      { wch: 15 }, // Date
      { wch: 10 }, // Status
      { wch: 12 }, // Ticket_Price
      { wch: 12 }, // Visitor_Price
      { wch: 12 }, // Ticket_Count
      { wch: 40 }, // Payment_Link
      { wch: 60 }, // Event_Details
      { wch: 60 }, // Terms
      { wch: 20 }, // Created_At
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Owner Events': worksheet },
      SheetNames: ['Owner Events'],
    };

    XLSX.writeFile(workbook, 'owner-events.xlsx');
  }

  // 🔍 Search
  applySearch() {
    this.filteredData = this.ownerEvents.filter(item =>
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
