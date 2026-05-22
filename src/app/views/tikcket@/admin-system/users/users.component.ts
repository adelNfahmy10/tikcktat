import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingService } from '@core/services/booking/booking.service';
import { EventService } from '@core/services/event/event.service';
import { UsersService } from '@core/services/users/users.service';
import emailjs from '@emailjs/browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  imports: [FormsModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  private readonly _BookingService = inject(BookingService)
  private readonly _UsersService = inject(UsersService)
  private readonly _ToastrService = inject(ToastrService)

  allUsers:any[] = []
  allBooking:any[] = []

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
    this.getAllUsers()
    this.getAllEvent()
  }

  getAllUsers(): void {
    this._UsersService.getAllUsers().subscribe({
      next: (res) => {
        this.allUsers = res;

        if (this.allBooking?.length) {
          this.mergeUsersWithBookings();
        }
      }
    });
  }

  getAllEvent(): void {
    this._BookingService.getAllBookings().subscribe({
      next: (res) => {
        this.allBooking = res;

        if (this.allUsers?.length) {
          this.mergeUsersWithBookings();
        }
      }
    });
  }

  mergeUsersWithBookings(): void {
    this.allUsers = this.allUsers.map((user: any) => ({
      ...user,
      bookings: this.allBooking.filter(
        (booking: any) => booking.userId === user.uid
      ),

      bookingsCount: this.allBooking.filter(
        (booking: any) => booking.userId === user.uid
      ).length,

      checkOneDateAt: this.allBooking
      .filter((booking: any) => booking.userId === user.uid)
      .map((b: any) => b?.checkOneDateAt?.toDate())
    }));

    console.log(this.allUsers);


    this.filteredData = [...this.allUsers];
    this.updatePagination();
  }


  sendConfirmEmail(email:string, eventName:string, userName:string):void{
    this.sendEmailToUser(email, eventName, userName)
  }

  // Email Send
  async sendEmailToUser(email:string, eventName:string, userName:string) {
    emailjs.init('1FX7lfc7iRKkWW7r1');
    try {
      const send = await emailjs.send("service_k3ieexg","template_2wo6cnq",{
        title: "Ticketateg Check Your Ticket",
        email: email,
        eventName: eventName,
        userName: userName,
      });

      this._ToastrService.success('Email Sent');

      return send;
    } catch (err) {
      console.error('EMAIL ERROR:', err);
      this._ToastrService.warning('Email failed but booking is saved');
      throw err;
    }
  }

  applySearch() {
    this.filteredData = this.allUsers.filter(item =>
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
