import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '@core/services/booking/booking.service';
import { EventService } from '@core/services/event/event.service';
import { UsersService } from '@core/services/users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap } from 'rxjs';
import emailjs from '@emailjs/browser';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-organizer-event-attendees',
  imports: [FormsModule, CommonModule],
  templateUrl: './organizer-event-attendees.component.html',
  styleUrl: './organizer-event-attendees.component.scss'
})
export class OrganizerEventAttendeesComponent {
  private readonly _EventService = inject(EventService)
  private readonly _UsersService = inject(UsersService);
  private readonly _BookingService = inject(BookingService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)
  private readonly _ToastrService = inject(ToastrService)
  private modalService = inject(NgbModal)

  eventId:string | null = null
  eventData: any = {};

  allUsers: any[] = [];
  allBooking: any[] = [];
  attendeesWithUsers: any[] = [];
  bookDataById:any

  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  page = 1;
  pageSize = 15;
  totalPages: number[] = [];

  filteredData:any[] = [];
  paginatedData: any[] = [];

  taxAmount: number = 0.02; // 2%

  ngOnInit() {
    this.getAttendeesByEventId()
    this.getEventById()
    this.getAllUsers()
    this.buildAttendees()
  }

  getEventById(): void {
    this._NgxSpinnerService.show()
    this._EventService.getEventById(this.eventId!).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide()
        this.eventData = res;
      },
      error: (err) => {
        this._NgxSpinnerService.hide()
        console.error(err);
      }
    });
  }

  getAllUsers(): void {
    this._NgxSpinnerService.show()
    this._UsersService.getAllUsers().subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide()
        this.allUsers = res;
        this.mergeData(); // 🔥 مهم
      }
    });
  }

  getAttendeesByEventId(): void {
    this._NgxSpinnerService.show()
    this._ActivatedRoute.paramMap
      .pipe(
        switchMap(params => {
          this.eventId = params.get('eventId');
          return this._BookingService.getBookingsByEvent(this.eventId!);
        })
      )
      .subscribe({
        next: (res) => {
          this._NgxSpinnerService.hide()
          this.allBooking = res;
          this.mergeData(); // 🔥 مهم
        }
      });
  }

  getBookById(id:any):void{
    this._NgxSpinnerService.show()
    this._BookingService.getBookingById(id).subscribe({
      next:(res)=>{
        this._NgxSpinnerService.hide()
        this.bookDataById = res
        console.log(this.bookDataById);

      },
      error:(err)=>{
        this._NgxSpinnerService.hide()
      }
    });
  }

  mergeData(): void {
    if (!this.allBooking.length || !this.allUsers.length) return;

    const usersMap = new Map(
      this.allUsers.map(u => [u.uid, u])
    );

    this.attendeesWithUsers = this.allBooking.map(b => {

      const user = usersMap.get(b.userId);

      return {
        ...b,
        userName: user?.fullName || 'Unknown',
        userEmail: user?.email || '',
        userPhone: user?.phone || ''
      };
    });

    this.filteredData = [...this.attendeesWithUsers];

    this.updatePagination();
  }

  buildAttendees(): void {
    const usersMap = new Map(
      this.allUsers.map(u => [u.uid, u])
    );

    this.attendeesWithUsers = this.allBooking.map(b => {

      const user = usersMap.get(b.userId);

      const companions = b.VisitorCount || 0;

      const ticketPrice = this.eventData?.TicketPrice || 0;
      const visitorPrice = this.eventData?.VisitorPrice || 0;

      const totalPrice =
        ticketPrice + (companions * visitorPrice);

      return {
        id: b.id,
        fullName: user?.fullName || 'Unknown',
        phone: user?.phone || '-',
        email: user?.email || '-',
        photoUrl: user?.photoUrl || 'assets/default.png',

        companions,
        totalPrice,

        attendance: b.attendance || 'Pending',
        status: b.status || 'Pending'
      };
    });

    this.filteredData = [...this.attendeesWithUsers];
    this.updatePagination();
  }

  downloadOwnerEvent(): void {
    if (!this.allBooking || this.allBooking.length === 0) return;

    const exportData = this.allBooking

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // تحسين عرض الأعمدة (اختياري بس مهم)
    // worksheet['!cols'] = [
    //   { wch: 40 }, // Event_Name
    //   { wch: 15 }, // Type
    //   { wch: 20 }, // Organizer
    //   { wch: 25 }, // Location_Name
    //   { wch: 40 }, // Location_Link
    //   { wch: 15 }, // Date
    //   { wch: 10 }, // Status
    //   { wch: 12 }, // Ticket_Price
    //   { wch: 12 }, // Visitor_Price
    //   { wch: 12 }, // Ticket_Count
    //   { wch: 40 }, // Payment_Link
    //   { wch: 60 }, // Event_Details
    //   { wch: 60 }, // Terms
    //   { wch: 20 }, // Created_At
    // ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Attendess': worksheet },
      SheetNames: ['Attendess Event'],
    };

    XLSX.writeFile(workbook, 'Attendess-Event.xlsx');
  }

  getTax(amount: number): number {
    return amount * this.taxAmount;
  }

  getFinal(amount: number): number {
    return amount - this.getTax(amount);
  }

  firstPaidAmount:number = 0

  async firstPaidCheck() {
    this._NgxSpinnerService.show();

    if(this.bookDataById?.userEmail){
      this._BookingService.updateBooking(this.bookDataById.id, {
        payOneAmount: this.firstPaidAmount,
        checkOneDateAt: new Date(),
        totalAmount: this.firstPaidAmount,
      }).subscribe({
        next: () => {
          this._NgxSpinnerService.hide();
          this.sendFirstEmail(this.bookDataById?.userEmail)
          this._ToastrService.success('✅ Paid One Check Successfully');
          this.modalService.dismissAll();
        },
        error: (err) => {
          this._NgxSpinnerService.hide();
          this._ToastrService.error('Paid One Check Failed');
        }
      });
    } else {
      this._ToastrService.error('Not Fount User Email');
    }

  }

  // 🔍 Search
  applySearch() {
    this.filteredData = this.attendeesWithUsers.filter(item =>
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

  // Email Send
  async sendFirstEmail(email:string) {
    emailjs.init('yDyM7-toHXTAEsac-');
    try {
      const send = await emailjs.send("service_r4d7bwe","template_846q1h5",{
        title: "Ticketateg",
        name: "Ticketat.eg",
        email: email,
      });

      this._ToastrService.success('Email Sent');

      return send;
    } catch (err) {
      console.error('EMAIL ERROR:', err);
      this._ToastrService.warning('Email failed but booking is saved');
      throw err;
    }
  }
}
