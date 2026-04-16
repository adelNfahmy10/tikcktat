import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '@core/services/booking/booking.service';
import { EventService } from '@core/services/event/event.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-my-booking',
  imports: [FormsModule, CommonModule],
  templateUrl: './my-booking.component.html',
  styleUrl: './my-booking.component.scss'
})
export class MyBookingComponent {
  private readonly _BookingService = inject(BookingService)
  private readonly _EventService = inject(EventService)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)

  // private readonly _ActivatedRoute = inject(ActivatedRoute)

  allBookings: any[] = [];
  userId: string | null = localStorage.getItem('userId')
  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  page = 1;
  pageSize = 15;
  totalPages: number[] = [];

  filteredData:any[] = [];
  paginatedData: any[] = [];


  ngOnInit() {
    this.getAllBooking()
  }

  // Get All Booking
  getAllBooking(): void {
    this._NgxSpinnerService.show()
    this._BookingService.getUserBookings(this.userId!).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide()
        this.allBookings = res;
        this.filteredData = res;
        this.updatePagination();
      }
    })
  }

  // 🔍 Search
  applySearch() {
    this.filteredData = this.allBookings.filter(item =>
      Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
    console.log(this.filteredData);

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

  // 📄 Change Page
  changePage(p: number) {
    if (p < 1 || p > this.totalPages.length) return;
    this.page = p;
    this.updatePagination();
  }

  // // Complete Payment
  // completePayment(id:any): void {
  //   console.log(id);
  // }
}
