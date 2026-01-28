import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-view-event',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './admin-view-event.component.html',
  styleUrl: './admin-view-event.component.scss'
})
export class AdminViewEventComponent implements OnInit{
  private modalService = inject(NgbModal)
  private readonly _AuthService = inject(AuthService)

  allUsers:any[] = []

  ngOnInit() {
    this.updatePagination();
    this.getAllUsers()
  }

  data = [
    {
      id: 1,
      company: 'NovaTech',
      eventimg: 'assets/images/tikecktImages/logos/full-logo.png',
      eventName: 'Music Night',
      location: 'Cairo',
      price: 200,
      bookingCount: 50,
      totalAmount: 10000,
      active: true,
    },
    {
      id: 2,
      company: 'BlueWave Solutions',
      eventimg: 'assets/images/tikecktImages/logos/full-logo.png',
      eventName: 'Tech Conference',
      location: 'Giza',
      price: 500,
      bookingCount: 20,
      totalAmount: 10000,
      active: false,
    },
    {
      id: 3,
      company: 'Vertex Group',
      eventimg: 'assets/images/tikecktImages/logos/full-logo.png',
      eventName: 'Art Exhibition',
      location: 'Alexandria',
      price: 150,
      bookingCount: 80,
      totalAmount: 12000,
      active: true,
    },
    {
      id: 4,
      company: 'Apex Digital',
      eventimg: 'assets/images/tikecktImages/logos/full-logo.png',
      eventName: 'Business Summit',
      location: 'New Cairo',
      price: 700,
      bookingCount: 30,
      totalAmount: 21000,
      active: true,
    },
    {
      id: 5,
      company: 'SkyLine Corp',
      eventimg: 'assets/images/tikecktImages/logos/full-logo.png',
      eventName: 'Stand-up Comedy',
      location: 'Nasr City',
      price: 250,
      bookingCount: 60,
      totalAmount: 15000,
      active: false,
    },
    {
      id: 6,
      company: 'NextGen Systems',
      eventimg: 'assets/images/tikecktImages/logos/full-logo.png',
      eventName: 'Startup Meetup',
      location: 'Sheikh Zayed',
      price: 180,
      bookingCount: 90,
      totalAmount: 16200,
      active: true,
    },
    {
      id: 7,
      company: 'Alpha Solutions',
      eventimg: 'assets/images/tikecktImages/logos/full-logo.png',
      eventName: 'Gaming Tournament',
      location: '6th of October',
      price: 350,
      bookingCount: 40,
      totalAmount: 14000,
      active: true,
    },
    {
      id: 8,
      company: 'BrightPath',
      eventimg: 'assets/images/tikecktImages/logos/full-logo.png',
      eventName: 'Photography Workshop',
      location: 'Zamalek',
      price: 220,
      bookingCount: 35,
      totalAmount: 7700,
      active: false,
    },
    {
      id: 9,
      company: 'Infinity Labs',
      eventimg: 'assets/images/tikecktImages/logos/full-logo.png',
      eventName: 'UX/UI Design Bootcamp',
      location: 'Maadi',
      price: 600,
      bookingCount: 25,
      totalAmount: 15000,
      active: true,
    },
    {
      id: 10,
      company: 'PrimeEdge',
      eventimg: 'assets/images/tikecktImages/logos/full-logo.png',
      eventName: 'AI & Future Tech Talk',
      location: 'Smart Village',
      price: 400,
      bookingCount: 55,
      totalAmount: 22000,
      active: false,
    },

  ];

  // table state
  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  page = 1;
  pageSize = 5;
  totalPages: number[] = [];

  filteredData = [...this.data];
  paginatedData: any[] = [];


  // 🔍 Search
  applySearch() {
    this.filteredData = this.data.filter(item =>
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

  getAllUsers():void{
    this._AuthService.getAllUsers().subscribe({
      next:(res)=>{
        this.allUsers = res.data
        console.log(this.allUsers);

      }
    })
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content)
  }
}
