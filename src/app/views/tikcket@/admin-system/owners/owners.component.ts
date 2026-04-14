import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '@core/services/event/event.service';
import { UsersService } from '@core/services/users/users.service';

@Component({
  selector: 'app-owners',
  imports: [FormsModule, CommonModule],
  templateUrl: './owners.component.html',
  styleUrl: './owners.component.scss'
})
export class OwnersComponent {
// private readonly _EventService = inject(EventService)
  private readonly _UsersService = inject(UsersService)

  allOwners:any[] = []

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
  }

  getAllOwners(){
    this._UsersService.getOwners().subscribe({
      next: (res) => {
        this.allOwners = res;
        this.filteredData = [...this.allOwners];
        this.updatePagination();
      },
      error: (err) => {
        console.error('Error fetching owners:', err);
      }
    });
  }

  // downloadOwnerEvent(): void {
  //   this._EventService.downloadAllEventOwners().subscribe({
  //     next: (res: Blob) => {
  //       const blob = new Blob([res], {
  //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  //       });
  //       const url = window.URL.createObjectURL(blob);

  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = 'All Owners.xlsx';
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);

  //       window.URL.revokeObjectURL(url);
  //       console.log('Download started!');
  //     },
  //     error: (err) => {
  //       console.error('Download failed', err);
  //     }
  //   });

  // }

  // 🔍 Search

  applySearch() {
    this.filteredData = this.allOwners.filter(item =>
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
