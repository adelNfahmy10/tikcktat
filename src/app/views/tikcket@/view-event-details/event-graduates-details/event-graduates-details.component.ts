import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@core/services/event/event.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-event-graduates-details',
  imports: [FormsModule, CommonModule],
  templateUrl: './event-graduates-details.component.html',
  styleUrl: './event-graduates-details.component.scss'
})
export class EventGraduatesDetailsComponent implements OnInit {
  private readonly _EventService = inject(EventService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)

  eventId:string | null = null
  eventType:string | null = null
  title: string = ''
  allAttendees: any[] = [];
  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  page = 1;
  pageSize = 5;
  totalPages: number[] = [];

  filteredData:any[] = [];
  paginatedData: any[] = [];


  ngOnInit() {
    this.getAttendeesByEventId()
  }

  getAttendeesByEventId(): void {
    this._ActivatedRoute.paramMap
      .pipe(
        switchMap(params => {
          this.eventId = params.get('eventId');
          this.eventType = params.get('type');
          this.title = this.eventType === 'GraduationParty' ? 'Graduates' : 'Attendees';
          return this._EventService.getEventAttendees(this.eventId);
        })
      )
      .subscribe({
        next: (res) => {
          this.allAttendees = res.data;
          this.filteredData = [...this.allAttendees];
          this.updatePagination()
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  // 🔍 Search
  applySearch() {
    this.filteredData = this.allAttendees.filter(item =>
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
