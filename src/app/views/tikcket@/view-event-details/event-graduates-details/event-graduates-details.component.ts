import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-graduates-details',
  imports: [FormsModule, CommonModule],
  templateUrl: './event-graduates-details.component.html',
  styleUrl: './event-graduates-details.component.scss'
})
export class EventGraduatesDetailsComponent {
  data = [
    {
      id: 1,
      imageUrl: 'assets/images/tikecktImages/logos/full-logo.png',
      fullName: 'Ashraf Mohamed',
      phone: '01023456789',
      email: 'ashraf@gmail.com',
      companions: 3,
      totalAmount: 7500,
      active: true,
    },
    {
      id: 2,
      imageUrl: 'assets/images/tikecktImages/logos/full-logo.png',
      fullName: 'Ahmed Hassan',
      phone: '01145678901',
      email: 'ahmed@gmail.com',
      companions: 2,
      totalAmount: 5000,
      active: false,
    },
    {
      id: 3,
      imageUrl: 'assets/images/tikecktImages/logos/full-logo.png',
      fullName: 'Mohamed Ali',
      phone: '01298765432',
      email: 'mohamed@gmail.com',
      companions: 4,
      totalAmount: 9000,
      active: true,
    },
    {
      id: 4,
      imageUrl: 'assets/images/tikecktImages/logos/full-logo.png',
      fullName: 'Sara Ibrahim',
      phone: '01099887766',
      email: 'sara@gmail.com',
      companions: 1,
      totalAmount: 3000,
      active: true,
    },
    {
      id: 5,
      imageUrl: 'assets/images/tikecktImages/logos/full-logo.png',
      fullName: 'Mona Adel',
      phone: '01122334455',
      email: 'mona@gmail.com',
      companions: 6,
      totalAmount: 12000,
      active: false,
    },
    {
      id: 6,
      imageUrl: 'assets/images/tikecktImages/logos/full-logo.png',
      fullName: 'Youssef Khaled',
      phone: '01233445566',
      email: 'youssef@gmail.com',
      companions: 2,
      totalAmount: 4800,
      active: true,
    },
    {
      id: 7,
      imageUrl: 'assets/images/tikecktImages/logos/full-logo.png',
      fullName: 'Nour Ahmed',
      phone: '01066778899',
      email: 'nour@gmail.com',
      companions: 5,
      totalAmount: 10500,
      active: true,
    },
    {
      id: 8,
      imageUrl: 'assets/images/tikecktImages/logos/full-logo.png',
      fullName: 'Omar Samir',
      phone: '01188990011',
      email: 'omar@gmail.com',
      companions: 3,
      totalAmount: 7200,
      active: false,
    },
    {
      id: 9,
      imageUrl: 'assets/images/tikecktImages/logos/full-logo.png',
      fullName: 'Hala Mostafa',
      phone: '01255667788',
      email: 'hala@gmail.com',
      companions: 1,
      totalAmount: 2500,
      active: true,
    },
    {
      id: 10,
      imageUrl: 'assets/images/tikecktImages/logos/full-logo.png',
      fullName: 'Karim Nabil',
      phone: '01011223344',
      email: 'karim@gmail.com',
      companions: 4,
      totalAmount: 8800,
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

  ngOnInit() {
    this.updatePagination();
  }

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
}
