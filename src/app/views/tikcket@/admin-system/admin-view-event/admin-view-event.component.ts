import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { EventService } from '@core/services/event/event.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-view-event',
  imports: [FormsModule, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './admin-view-event.component.html',
  styleUrl: './admin-view-event.component.scss'
})
export class AdminViewEventComponent implements OnInit{
  private modalService = inject(NgbModal)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _AuthService = inject(AuthService)
  private readonly _EventService = inject(EventService)
  private readonly _ToastrService = inject(ToastrService)

  allUsers:any[] = []
  allEvents:any[] = []

  ngOnInit() {
    this.getAllUsers()
    this.getAllEvent()
  }


  // table state
  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  page = 1;
  pageSize = 15;
  totalPages: number[] = [];

  filteredData:any[] = [];
  paginatedData: any[] = [];


  // 🔍 Search
  applySearch() {
    this.filteredData = this.allEvents.filter(item =>
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
    console.log(total);
    console.log(this.allEvents);

  }

  changePage(p: number) {
    if (p < 1 || p > this.totalPages.length) return;
    this.page = p;
    this.updatePagination();
  }

  getAllUsers():void{
    this._AuthService.getAllUsers().subscribe({
      next:(res)=>{
        this.allUsers = res.data
      }
    })
  }

  getAllEvent():void{
    this._EventService.getAllAdminEvents().subscribe({
      next:(res)=>{
        this.allEvents = res.data
        this.filteredData =[...this.allEvents]
        this.updatePagination();
      }
    })
  }

  downloadAllEvents(): void {
    this._EventService.downloadGetAllEvents().subscribe({
      next: (res: Blob) => {
        const blob = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'All Events.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
        console.log('Download started!');
      },
      error: (err) => {
        console.error('Download failed', err);
      }
    });
  }

  assignForm:FormGroup = this._FormBuilder.group({
    userId: [null, Validators.required],
    eventId: [null, Validators.required]
  })

  submitAssignOwnerToEvent():void{
    let data  = this.assignForm.value

    this._EventService.assignOwnerToEvent(data).subscribe({
      next:(res)=>{
        this._ToastrService.success(res.msg)
        this.assignForm.reset()
        this.modalService.dismissAll()
      },
      error:(err)=>{
        this._ToastrService.error(err.error.msg)
      }
    })
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content)
  }
}
