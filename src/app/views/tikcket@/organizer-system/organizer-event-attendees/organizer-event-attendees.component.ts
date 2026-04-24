import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '@core/services/booking/booking.service';
import { EventService } from '@core/services/event/event.service';
import { UsersService } from '@core/services/users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, switchMap } from 'rxjs';
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

  totalOutComerCount:number = 0
  totalVisitorCount:number = 0
  totalDefaultVisitorCount:number = 0
  totalRevenue:number = 0
  totalTaxes:number = 0
  hasStudentsColumn: boolean = false;

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

           // 🔥 1. sort هنا قبل أي processing
          this.allBooking = res.sort((a: any, b: any) => {
            const aDate = a?.createdAtOne?.seconds || a?.checkOneDateAt?.seconds || 0;
            const bDate = b?.createdAtOne?.seconds || b?.checkOneDateAt?.seconds || 0;
            return aDate - bDate; // 🔥 القديم فوق - الجديد تحت
          });

          // 👨‍👩‍👧 total Vsisitos
          this.totalOutComerCount= this.allBooking.reduce((sum, b) => {
            return sum + (b.VisitorCount + b.defaultVisitorCount || 0);
          }, 0);

          this.totalVisitorCount = this.allBooking.reduce((sum, b) => {
            return sum + (b.VisitorCount || 0);
          }, 0);

          // 👨‍👩‍👧 defaultVisitorCount لوحده
          this.totalDefaultVisitorCount = this.allBooking.reduce((sum, b) => {
            return sum + (b.defaultVisitorCount || 0);
          }, 0);

          // 💰 total revenue
          this.totalRevenue = this.allBooking.reduce((sum, item) => sum + (item.totalAmount || 0), 0);

          this.totalTaxes = this.totalRevenue * 0.02;

          // 🔥 تقسيم
          this.groupedByDepartment = this.allBooking.reduce((acc: any, item: any) => {
            const dept = item.department || 'Unknown';

            if (!acc[dept]) {
              acc[dept] = [];
            }

            acc[dept].push(item);
            return acc;
          }, {});

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

    // ✅ هنا نحدد هل العمود يظهر ولا لا
    this.hasStudentsColumn = this.attendeesWithUsers.some(
      a => a.studentsIDs != null
    );

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

  getTax(amount: number): number {
    return amount * this.taxAmount;
  }

  getFinal(amount: number): number {
    return amount - this.getTax(amount);
  }

  paidAmount:number = 0

  async paidCheck() {
    this._NgxSpinnerService.show();
    if(this.bookDataById?.userEmail){
      if(!this.bookDataById.payOneAmount){
        this._BookingService.updateBooking(this.bookDataById.id, {
          payOneAmount: this.paidAmount,
          checkOneDateAt: new Date(),
          totalAmount: this.paidAmount,
          status: 'Par-Paid',
        }).subscribe({
          next: () => {
            this._NgxSpinnerService.hide();
            this.sendEmailToUser(this.bookDataById?.userEmail, this.bookDataById?.EventName, this.bookDataById?.userName)
            this._ToastrService.success('✅ Paid One Check Successfully');
            this.modalService.dismissAll();
            this.paidAmount = 0
          },
          error: (err) => {
            this._NgxSpinnerService.hide();
            this._ToastrService.error('Paid One Check Failed');
          }
        });
      } else {
        const totalPaid = this.paidAmount + this.bookDataById.payOneAmount;
        const eventPrice = this.eventData.TicketPrice; // أو السعر الفعلي
        const status = totalPaid >= eventPrice ? 'Paid' : 'Par-Paid';

        // ✅ validation
        if (totalPaid < eventPrice) {
          this._ToastrService.error('❌ المبلغ المدفوع أقل من سعر الحفلة');
          return;
        }

        // ✅ API Call
        this._BookingService.updateBooking(this.bookDataById.id, {
          payTwoAmount: this.paidAmount,
          checkTwoDateAt: new Date(),
          totalAmount: totalPaid,
          status: status
        }).subscribe({
          next: (res) => {
            this._NgxSpinnerService.hide();
            this.sendEmailToUser(this.bookDataById?.userEmail, this.bookDataById?.EventName,this.bookDataById?.userName)
            this._ToastrService.success('✅ Paid Two Check Successfully');
            this.modalService.dismissAll();
          },
          error: (err) => {
            this._NgxSpinnerService.hide();
            this._ToastrService.error('❌ Paid Two Check Failed');
          }
        });
      }

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

  // 📄 All Pagination
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
    // 🔥 scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.updatePagination();
  }

  // 📄 Custom Pagination
  groupedByDepartment: Record<string, any[]> = {};
  departmentPages: Record<string, number> = {};
  itemsPerPage = 5;

  // 🔹 تجميع الداتا حسب القسم
  groupUsersByDepartment() {
    this.groupedByDepartment = this.allUsers.reduce((acc: Record<string, any[]>, user: any) => {
      const dept = user?.department || 'Unknown';

      if (!acc[dept]) {
        acc[dept] = [];
      }

      acc[dept].push(user);
      return acc;
    }, {});

    // 🔥 مهم: نعمل init للصفحات هنا
    Object.keys(this.groupedByDepartment).forEach((dept) => {
      this.departmentPages[dept] = 1;
    });
  }

  // 🔹 pagination data
  getPaginatedDepartment(dept: string) {
    const users = this.groupedByDepartment[dept] || [];

    const page = this.departmentPages[dept] ?? 1;

    const start = (page - 1) * this.itemsPerPage;

    return users.slice(start, start + this.itemsPerPage);
  }

  // 🔹 total pages
  getTotalPages(dept: string): number[] {
    const total = this.groupedByDepartment[dept]?.length ?? 0;

    const pages = Math.ceil(total / this.itemsPerPage);

    return Array.from({ length: pages }, (_, i) => i + 1);
  }

  // 🔹 تغيير الصفحة (بـ validation)
  changeDepartmentPage(dept: string, page: number) {
    const totalPages = this.getTotalPages(dept).length;

    if (page < 1 || page > totalPages) return; // 🔥 حماية

    this.departmentPages[dept] = page;
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

  // Download Excels
  allDataInExcel() {

    let frenchCount = 1;
    let englishCount = 1;

    const sheetData = this.allBooking.map((item: any) => {

      let seatNumber = '';

      if (item?.department === 'French') {
        seatNumber = `A${frenchCount++}`;
      }

      else if (item?.department === 'English') {
        seatNumber = `B${englishCount++}`;
      }

      return {
        UserId: item?.userId,
        SeatNumber: seatNumber,
        UserName: item?.userName,
        Department: item?.department,
        Email: item?.userEmail,
        Phone: item?.userPhone,
        Status: item?.status,
        TotalAmount: item?.totalAmount,
        PayOneAmount: item?.payOneAmount,
        checkOneDateAt: item?.checkOneDateAt?.seconds
          ? new Date(item.checkOneDateAt.seconds * 1000)
          : '',
        PayTwoAmount: item?.payTwoAmount,
        checkTwoDateAt: item?.checkTwoDateAt?.seconds
          ? new Date(item.checkTwoDateAt.seconds * 1000)
          : ''
      };
    });

    const sheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, sheet, 'All Bookings');

    XLSX.writeFile(workbook, 'all-bookings.xlsx');
  }

  // Excel Seat No.
  seatNumberByDepartmentExcel(dept: string) {

    const deptData = this.groupedByDepartment[dept] || [];

    let count = 1;

    const prefixMap: any = {
      'French': 'A',
      'English': 'B'
    };

    const prefix = prefixMap[dept] || '';

    const sheetData = deptData.map((item: any) => ({
      SeatNumber: prefix ? `${prefix}${count++}` : '',
      UserName: item.userName,
      Department: dept,
    }));

    const sheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, sheet, dept);

    XLSX.writeFile(workbook, `${dept}-seat-number.xlsx`);
  }

  // Excel Number A-Z Or أ-ي
  sortNamesByDepartmentExcel(type: 'arabic' | 'english') {

    Object.keys(this.groupedByDepartment).forEach((dept: string) => {

      const deptData = this.groupedByDepartment[dept];

      let usersData: any[] = [];
      let completed = 0;

      const total = deptData.length;

      deptData.forEach((item: any, index: number) => {

        this._UsersService.getUserById(item.userId)
          .subscribe(user => {

            const name =
              type === 'arabic'
                ? user?.fullNameAr || item.userName
                : user?.fullName || item.userName;

            usersData[index] = {
              name: name
            };

            completed++;

            // ✅ لما يخلصوا كلهم
            if (completed === total) {

              // 🔤 Sort
              usersData.sort((a, b) =>
                (a.name || '').localeCompare(
                  b.name || '',
                  type === 'arabic' ? 'ar' : 'en'
                )
              );

              // 📄 تجهيز الشيت
              const sheetData = usersData.map(x => ({
                [type === 'arabic'
                  ? 'الأسماء_بالعربي_أبجدي'
                  : 'English_Names_Sorted']: x.name
              }));

              const sheet = XLSX.utils.json_to_sheet(sheetData);
              const workbook = XLSX.utils.book_new();

              XLSX.utils.book_append_sheet(workbook, sheet, dept);

              XLSX.writeFile(workbook, `${dept}-${type}.xlsx`);
            }

          });

      });

    });
  }

  downloadScarfExcel() {
    const sheetData = this.allBooking.map(item => ({
      GraduationScarfName: item.GraduationScarfName || item.userName
    }));

    const sheet = XLSX.utils.json_to_sheet(sheetData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, sheet, 'Scarf Names');

    XLSX.writeFile(workbook, 'scarf-names.xlsx');
  }
}
