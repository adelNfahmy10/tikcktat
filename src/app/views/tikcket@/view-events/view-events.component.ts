import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService } from '@core/services/event/event.service';

@Component({
  selector: 'app-view-events',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './view-events.component.html',
  styleUrl: './view-events.component.scss'
})
export class ViewEventsComponent implements OnInit{
  private readonly _EventService = inject(EventService)

  ownerEvents:any[] = []

  // table state
  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  page = 1;
  pageSize = 5;
  totalPages: number[] = [];
  filteredData:any[] = [];
  paginatedData: any[] = [];


  ngOnInit() {
    this.getOwnerEvents()
  }


  getOwnerEvents(){
    const userId = localStorage.getItem('userId');
    if (userId) {
      this._EventService.GetEventsByOwner(userId).subscribe({
        next: (res) => {
          this.ownerEvents = res.data;
          this.filteredData = [...this.ownerEvents];
          this.updatePagination();
        },
        error: (err) => {
          console.error('Error fetching owner events:', err);

        }
      });
    }
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
