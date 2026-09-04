import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '@core/services/booking/booking.service';
import { EventService } from '@core/services/event/event.service';
import { UsersService } from '@core/services/users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, from, map, mergeMap, switchMap, take, toArray } from 'rxjs';
import emailjs from '@emailjs/browser';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { DownloadExcelService } from '@core/services/excel/download-excel.service';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { SendmailService } from '@core/services/send-email/sendmail.service';
import Swal from 'sweetalert2';
import { doc, writeBatch } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-organizer-event-attendees',
  imports: [FormsModule, CommonModule ],
  templateUrl: './organizer-event-attendees.component.html',
  styleUrl: './organizer-event-attendees.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class OrganizerEventAttendeesComponent {
  private readonly _EventService = inject(EventService)
  private readonly _UsersService = inject(UsersService);
  private readonly _BookingService = inject(BookingService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)
  private readonly _SendmailService = inject(SendmailService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _DownloadExcelService = inject(DownloadExcelService)
  private readonly _Router = inject(Router)
  private modalService = inject(NgbModal)

  role:string | null = localStorage.getItem('role')
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
    setTimeout(() => {
      this.initStorageWatcher();
    }, 1500);
  }

  // #################### Check Change Any Data in LocalStorage ####################
  initialUserId: string | null = null;
  initialRole: string | null = null;
  intervalId: any;
  isWatching = false;

  initStorageWatcher(): void {
    if (this.isWatching) return;

    this.initialUserId = localStorage.getItem('userId');
    this.initialRole = localStorage.getItem('role');

    this.isWatching = true;

    this.intervalId = setInterval(() => {
      const currentUserId = localStorage.getItem('userId');
      const currentRole = localStorage.getItem('role');

      if (
        currentUserId !== this.initialUserId ||
        currentRole !== this.initialRole
      ) {
        this.forceLogout();
      }
    }, 1000);
  }

  forceLogout(): void {
    clearInterval(this.intervalId);

    localStorage.clear();

    this._ToastrService.error(
      'You have been logged out due to unauthorized changes'
    );

   this._Router.navigate(['/']).then(() => {
      window.location.reload();
    });

  }

  checkEventOwner(): void {
    this.initialUserId = localStorage.getItem('userId');
    const eventOwnerId = this.eventData?.OwnerId;
    const TicketatAdmin = 'jDVUo3eEtlWOMBAvlacWLlQ8odN2';

    if (!this.initialUserId || ( this.initialUserId !== eventOwnerId && this.initialUserId !== TicketatAdmin)) {
      this._Router.navigate(['/']).then(() => {
        window.location.reload();
      });
    }
  }

  // #################### Start Get Event By ID ####################
  getEventById(): void {
    this._NgxSpinnerService.show()
    this._EventService.getEventById(this.eventId!).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide()
        this.eventData = res;

        this.checkEventOwner()
      },
      error: (err) => {
        this._NgxSpinnerService.hide()
        console.error(err);
      }
    });
  }


  // #################### Start Get All Users ####################
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

  // #################### Start Get Owner By Id ####################
  getUserById():void{
    this._UsersService.getOwners().subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide()
        this.allUsers = res;
        this.mergeData(); // 🔥 مهم
      }
    });
  }

  // #################### Router To Attendees Details ####################
  goToAttendeesDetails(id: any): void {
    this.getBookById(id, () => {
      this._Router.navigate(['/attendees-details/', this.bookingId]);
    });
  }

  pendingCount:number = 0
  parPaidCount:number = 0
  paidCount:number = 0
  totalOutComerCount:number = 0
  totalNewOutcomersPrice:number = 0
  totalVisitorCount:number = 0
  totalDefaultVisitorCount:number = 0
  totalPayOne:number = 0
  totalPayTwo:number = 0
  totalRevenue:number = 0
  totalTaxes:number = 0
  totalEventAmount:number = 0
  hasStudentsColumn: boolean = false;
  hasDepartmentColumn: boolean = false;

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

          this.pendingCount = this.allBooking.filter((book:any)=>{
            return book.status == 'Pending'
          }).length
          this.parPaidCount = this.allBooking.filter((book:any)=>{
            return book.status == 'Par-Paid'
          }).length
          this.paidCount = this.allBooking.filter((book:any)=>{
            return book.status == 'Paid'
          }).length

           // 🔥 1. sort هنا قبل أي processing
          this.allBooking = res.sort((a: any, b: any) => {
            const aDate = a?.createdAtOne?.seconds || a?.checkOneDateAt?.seconds || 0;
            const bDate = b?.createdAtOne?.seconds || b?.checkOneDateAt?.seconds || 0;
            return aDate - bDate; // 🔥 القديم فوق - الجديد تحت
          });

          // 👨‍👩‍👧 total outcomers Count
          this.totalOutComerCount= this.allBooking.reduce((sum, b) => {
            return sum + (b.VisitorCount + b.defaultVisitorCount || 0);
          }, 0);

          // total new outcomers extra count
          this.totalVisitorCount = this.allBooking.reduce((sum, b) => {
            return sum + (b.VisitorCount || 0);
          }, 0);

          // total default outcomers count
          this.totalDefaultVisitorCount = this.allBooking.reduce((sum, b) => {
            return sum + (b.defaultVisitorCount || 0);
          }, 0);

          // 💰 total revenue amount
          this.totalRevenue =Math.round(
            this.allBooking.reduce((sum, item) => sum + (item.totalAmount || 0), 0)
          );

          // 💰 total pay one amount
          this.totalPayOne =Math.round(
            this.allBooking.reduce((sum, item) => sum + (item.payOneAmount || 0), 0)
          );

          // 💰 total pay two amount
          this.totalPayTwo =Math.round(
            this.allBooking.reduce((sum, item) => sum + (item.payTwoAmount || 0), 0)
          );

          // 💰 total new outcomers amount
          this.totalNewOutcomersPrice = Math.round(
            this.allBooking.reduce(
              (total, booking) =>
                total +
                (booking.newOutcomers || []).reduce(
                  (sum:any, outcomer:any) => sum + Number(outcomer.price || 0),
                  0
                ),
              0
            )
          )

          this.totalEventAmount = this.totalRevenue + this.totalNewOutcomersPrice

          this.totalTaxes = Math.round(this.totalEventAmount * 0.02);

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

  eventName:string = ''
  bookingId:any = ''
  getBookById(id: any, callback?: () => void): void {
    this._NgxSpinnerService.show();

    this._BookingService.getBookingById(id).subscribe({
      next: (res) => {
        this._NgxSpinnerService.hide();
        this.bookDataById = res;
        this.bookingId = res.id;

        callback?.();
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
        console.error(err);
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

    this.hasDepartmentColumn = this.attendeesWithUsers.some(
      a => a.department != null
    );

    this.filteredData = [...this.attendeesWithUsers];

    this.getUnCheckAttendess()

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
    return Math.floor(amount * this.taxAmount);
  }

  getFinal(amount: number): number {
    return amount - this.getTax(amount);
  }

  paidAmount:number | null = null
  MsgErr:string = ''

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
            this.sendConfirmEmail(this.bookDataById?.userEmail, this.bookDataById?.EventName, this.bookDataById?.userName)
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
          this._NgxSpinnerService.hide();
          this._ToastrService.error('❌ المبلغ المدفوع أقل من سعر الحفلة');
          this.MsgErr = '❌ المبلغ المدفوع أقل من سعر الحفلة'
          return;
        }

        if (this.paidAmount != this.bookDataById?.totalReq) {
          this._NgxSpinnerService.hide();
          this._ToastrService.error('❌ المبلغ غير مطابق للمطلوب دفعه');
          this.MsgErr = '❌ المبلغ غير مطابق للمطلوب دفعه'
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
            this.sendFinalConfirmEmail(this.bookDataById?.userEmail, this.bookDataById?.EventName, this.bookDataById?.userName)
            this._ToastrService.success('✅ Paid Two Check Successfully');
            this.modalService.dismissAll();
          },
          error: (err) => {
            this._NgxSpinnerService.hide();
            this._ToastrService.error('❌ Paid Two Check Failed');
            this.MsgErr = '❌ Paid Two Check Failed'
          }
        });
      }

    } else {
      this._ToastrService.error('Not Fount User Email');
      this.MsgErr = 'Not Fount User Email'
    }

  }

  unCheckedAttendess:any[] = []
  unCheckedOutcomersPayment:any[] = []
  allCheck:any[] = []
  finalCheckCount:number = 0
  // Get UnCheck Attendess Paid Two
  getUnCheckAttendess():void{
    this.unCheckedAttendess = this.filteredData.filter((item)=>  item.totalReq && (item.totalReq != item.payTwoAmount))
    this.unCheckedOutcomersPayment = this.filteredData.filter((item: any) =>
      item?.newOutcomers?.some((outcomer: any) => outcomer.price === 0)
    );

    this.finalCheckCount = this.filteredData.filter((item)=>  item.totalReq && (item.totalReq == item.payTwoAmount)).length
    this.allCheck = this.filteredData.filter((item)=>  item.totalReq && (item.totalReq == item.payTwoAmount))
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
   document.getElementById('head-table')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    this.updatePagination();
  }

  // 📄 Custom Pagination
  groupedByDepartment: Record<string, any[]> = {};
  departmentPages: Record<string, number> = {};
  itemsPerPage = 5;

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

  canSendQrs(bookingData: any): boolean {

    // لازم يكون الدفع الأساسي مكتمل
    // if (bookingData?.status !== 'Paid') {
    //   return false;
    // }

    // لو مفيش مرافقين يبقى خلاص
    if (!bookingData?.newOutcomers?.length && bookingData?.status) {
      return true;
    }

    // كل المرافقين لازم يكون عندهم price
    return bookingData.newOutcomers.every(
      (outcomer: any) => Number(outcomer.price) > 0
    );
  }
  // ########################## Set QRs SeatNumber ##########################
  complateSeatNumber(): void {

    if (!this.filteredData || this.filteredData.length === 0) {
      this._ToastrService.warning('No bookings found');
      return;
    }

    // const specialEventId = 'uvoo0zHQzwK1efCTBynh';

    let bookingsToUpdate = [...this.filteredData];

    // if (this.eventData?.id === specialEventId) {
    //   bookingsToUpdate.sort((a, b) => {
    //     const aTime = a.createdAtTwo?.seconds || 0;
    //     const bTime = b.createdAtTwo?.seconds || 0;

    //     return aTime - bTime;
    //   });
    // }


    this._EventService.updateAllBookingsQrsWithSeats(bookingsToUpdate).subscribe({
      next: () => {
        this._ToastrService.success('Seats Updated Successfully');
      },
      error: (err) => {
        console.log(err);
        this._ToastrService.error('Seats Updated Wrong!');
      }
    });

  }

  complateSeatNumberByEvent(): void {

    if (!this.filteredData || this.filteredData.length === 0) {
      this._ToastrService.warning('No bookings found');
      return;
    }

    const bookingsToUpdate = [...this.filteredData];

    this._EventService
      .updateAllBookingsQrsWithSeatsByEvent(bookingsToUpdate)
      .subscribe({
        next: () => {
          this._ToastrService.success('Seats Updated Successfully');
        },
        error: (err) => {
          console.log(err);
          this._ToastrService.error('Seats Updated Wrong!');
        }
      });
  }


  // Email Send Templates
  // SMTP Bravo
  sendConfirmEmail(email:string, eventName:string, userName:string):void{
    let data = {
      to: email,
      userName: userName,
      eventName: eventName
    }

    this._SendmailService.sendMail(data).subscribe({
      next: (res) => {
        this._ToastrService.success('Email Sent');
      },
      error: (err) => {
        this._ToastrService.warning('Email failed !');
      }
    });
  }

  sendFinalConfirmEmail(email:string, eventName:string, userName:string):void{
    let data = {
      to: email,
      userName: userName,
      eventName: eventName
    }

    this._SendmailService.sendConfirmBooking(data).subscribe({
      next: (res) => {
        this._ToastrService.success('Email Sent');
      },
      error: (err) => {
        this._ToastrService.warning('Email failed !');
      }
    });
  }

  // STMP QRS Bravo
  sendFinalQrs(email:string, eventName:string, userName:string, qrs: any[]):void{
    const data = {
      to: email,
      name: userName,
      eventName: eventName,
      qrs: qrs
    };

    this._SendmailService.sendQrs(data).subscribe({
      next: () => {
        this._ToastrService.success('Email Sent');
      },
      error: (err) => {
        console.error(err);
        this._ToastrService.error('Email failed!');
      }
    });
  }

  sendAllFinalQrs(): void {

    // كل الحجوزات اللي ينفع يتبعتلها
    const bookings = this.filteredData.filter((booking: any) =>
      this.canSendQrs(booking)
    );

    if (!bookings.length) {
      this._ToastrService.warning('No eligible bookings found.');
      return;
    }

    let success = 0;
    let failed = 0;

    bookings.forEach((booking: any) => {

      const data = {
        to: booking.userEmail,
        name: booking.userName,
        eventName: booking.EventName,
        qrs: booking.qrs
      };

      this._SendmailService.sendQrs(data).subscribe({
        next: () => {
          success++;
          checkFinished();
        },
        error: (err) => {
          console.error(err);
          failed++;
          checkFinished();
        }
      });

    });

    const checkFinished = () => {

      if (success + failed !== bookings.length) {
        return;
      }

      const eventData = {
        successQrs: success,
        failedQrs: failed,
      };

      this._EventService.updateEvent(this.eventData.id, eventData).subscribe({
        next: () => {
          this._ToastrService.success(
            `${success} emails sent, ${failed} failed`
          );
        },
        error: (err) => {
          console.error(err);
          this._ToastrService.error('Update Event Failed');
        }
      });

    };

  }

  // EmailJS
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

  // Delete Booking
  deleteBooking(booking: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This booking will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it'
    }).then((result) => {

      if (result.isConfirmed) {

        // 1️⃣ Delete booking
        this._BookingService.deleteBooking(booking.id).subscribe({
          next: () => {

            // 2️⃣ Decrease event tickets
            this._EventService.decreaseEventTickets(
              booking.EventId,
              booking.ticketsCount || 1
            ).subscribe();

            // 3️⃣ UI update
            this.mergeData()

            Swal.fire('Deleted!', 'Booking has been deleted.', 'success');
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error!', 'Something went wrong.', 'error');
          }
        });
      }
    });

  }
  // ########################## Download Excels ##########################
  // Formate Date in Excel
  private formatDate(timestamp: any): string {
    if (!timestamp) return '';

    // Firestore Timestamp
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }

    // لو Date جاهز
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    }

    return '';
  }

  // Download All Bookings
  downloadAll(): void {
    from(this.allBooking).pipe(
      mergeMap(b =>
        this._UsersService.getUserById(b.userId).pipe(
          take(1),
          map(user => ({
            ...b,
            userNameAr: user?.fullNameAr || ''
          }))
        )
      ),
      toArray()
    ).subscribe({
      next: (data) => {

        // 👇 ترتيب الأعمدة (كل الداتا + ترتيب ثابت)
        const orderedData = data.map(item => ({
          id: item.id,
          userId: item.userId,
          StudendId: item?.studentsIDs || '-',
          userImage: item.userImage,

          userName: item.userName,
          userNameAr: item.userNameAr,
          userPhone: item.userPhone,
          userEmail: item.userEmail,

          GraduationScarfName: item.GraduationScarfName,
          EventName: item.EventName,
          department: item.department,

          totalAmount: item.totalAmount,

          createdAtOne: this.formatDate(item.createdAtOne),
          payOneAmount: item.payOneAmount,
          payOneRef: item.payOneRef,
          payOneImage: item.payOneImage,
          checkOneDateAt: this.formatDate(item.checkOneDateAt),

          createdAtTwo: this.formatDate(item.createdAtTwo),
          payTwoAmount: item.payTwoAmount,
          payTwoRef: item.payTwoRef,
          payTwoImage: item.payTwoImage,
          checkTwoDateAt:this.formatDate(item.checkTwoDateAt),

          defaultVisitorCount: item.defaultVisitorCount,
          VisitorCount: item.VisitorCount,

          qrs: item.qrs,
          status: item.status,

          OwnerId: item.OwnerId,
          EventId: item.EventId,
        }));

        this._DownloadExcelService.exportExcel(
          orderedData,
          'All Bookings'
        );
      },
      error: () => {}
    });
  }

  // Download All StudentIDs
  downloadStudentIDs(): void {
    from(this.allBooking).pipe(
      mergeMap(b =>
        this._UsersService.getUserById(b.userId).pipe(
          take(1),
          map(user => ({
            ...b,
            userNameAr: user?.fullNameAr || ''
          }))
        )
      ),
      toArray()
    ).subscribe({
      next: (data) => {
        const orderedData = data.sort((a, b) => {
          const idA = a?.studentsIDs || '';
          const idB = b?.studentsIDs || '';

          return idA.localeCompare(idB, undefined, { numeric: true });
        })
        .map(item => ({
          StudendId: item?.studentsIDs || '-',
          userNameAr: item.userNameAr,
          userName: item.userName,
        }));

        this._DownloadExcelService.exportExcel(
          orderedData,
          'All Students IDs'
        );
      },
      error: () => {}
    });
  }

  // Download Departments Data
  downloadAllDepartments(): void {

    (this.eventData?.departments || []).forEach((dept: string) => {

      const deptClean = dept.trim().toLowerCase();

      const deptData = this.allBooking.filter(b =>
        (b.department || '').trim().toLowerCase() === deptClean
      );

      if (!deptData.length) return;

      from(deptData).pipe(
        mergeMap(item =>
          this._UsersService.getUserById(item.userId).pipe(
            take(1),
            map(user => ({
              userNameEn: item.userName,
              userNameAr: user?.fullNameAr || '',
              userPhone: item.userPhone,
              userEmail: item.userEmail,
              department: item.department,
              ScarfName: item.GraduationScarfName,
              status: item.status,
              userImage: item.userImage || '',
            }))
          )
        ),
        toArray()
      ).subscribe(finalData => {

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalData);

        const workbook: XLSX.WorkBook = {
          Sheets: { data: worksheet },
          SheetNames: ['data']
        };

        const excelBuffer: any = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
        });

        const blob: Blob = new Blob([excelBuffer], {
          type: 'application/octet-stream'
        });

        saveAs(blob, `${dept}.xlsx`);
      });

    });

  }

  // Download Shield Sheet
  downloadShieldSheet(): void {
    from(this.allBooking).pipe(
      mergeMap(b =>
        this._UsersService.getUserById(b.userId).pipe(
          take(1),
          map(user => ({
            ...b,
            userNameAr: user?.fullNameAr || '',
            userNameEn: user?.fullName || '',
          }))
        )
      ),
      toArray()
    ).subscribe({
      next: (data) => {

        const orderedData = data.map(item => ({
          userNameEn: item.userNameEn || 'Unknown',
          userNameAr: item.userNameAr || item.userNameEn || 'Unknown',
          department: item.department || 'Unknown',
          userImage: item.userImage || '',
        }));

        this._DownloadExcelService.exportExcel(
          orderedData,
          'Shield-Sheet'
        );
      },
      error: () => {}
    });
  }

  // Download Scraf Name Sheet
  downloadScarfNames(): void {
    from(this.allBooking).pipe(
      map(b => ({
        userName: b.userName || '',
        ScarfName: b.GraduationScarfName || '',
        department: b.department || '',
      })),
      toArray()
    ).subscribe({
      next: (data) => {

        const orderedData = data.map(item => ({
          ScarfName: item.ScarfName || item.userName || 'Unknown',
          department: item.department,
        }));

        this._DownloadExcelService.exportExcel(
          orderedData,
          'Scarf Names'
        );
      }
    });
  }

  // Download Sort Name Sheet By Departments (FIXED VERSION)
  downloadAllDepartmentsSorted(type: 'arabic' | 'english'): void {

    const departments = this.eventData?.departments || [];

    const collator = new Intl.Collator(type === 'arabic' ? 'ar' : 'en', {
      sensitivity: 'base',
      numeric: true
    });

    departments.forEach((dept: string) => {

      const deptClean = dept.trim().toLowerCase();

      const deptData = this.allBooking.filter(b =>
        (b.department || '').trim().toLowerCase() === deptClean
      );

      if (!deptData.length) return;

      forkJoin(
        deptData.map(item =>
          this._UsersService.getUserById(item.userId).pipe(
            take(1),
            map(user => ({
              userName: item.userName,
              userNameAr: user?.fullNameAr || item.userName,
              department: item.department,
              userImage: item.userImage,
            }))
          )
        )
      ).pipe(

        map(list => {

          return list.sort((a, b) => {

            const nameA =
              (type === 'arabic' ? a.userNameAr : a.userName) || '';

            const nameB =
              (type === 'arabic' ? b.userNameAr : b.userName) || '';

            return collator.compare(
              nameA.trim(),
              nameB.trim()
            );
          });

        })

      ).subscribe(sorted => {

        const sheetData = sorted.map(item => ({
          userNameEn: item.userName,
          userNameAr: item.userNameAr,
          department: item.department,
          userImage: item.userImage,
        }));

        const worksheet = XLSX.utils.json_to_sheet(sheetData);

        const workbook: XLSX.WorkBook = {
          Sheets: { data: worksheet },
          SheetNames: ['data']
        };

        const buffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
        });

        const blob = new Blob([buffer], {
          type: 'application/octet-stream'
        });

        saveAs(blob, `${dept}-sorted-${type}.xlsx`);
      });

    });
  }

  downloadAllSorted(type: 'arabic' | 'english'): void {

    const allData = this.allBooking || [];

    const collator = new Intl.Collator(type === 'arabic' ? 'ar' : 'en', {
      sensitivity: 'base',
      numeric: true
    });

    const requests = allData.map(item =>
      this._UsersService.getUserById(item.userId).pipe(
        take(1),
        map(user => ({
          userNameAr: user?.fullNameAr || item.userName,
          userName: item.userName,
          department: item.department,
          userImage: item.userImage,
        }))
      )
    );

    forkJoin(requests).pipe(

      map(list =>
        list.sort((a, b) => {

          const nameA = (type === 'arabic' ? a.userNameAr : a.userName) || '';
          const nameB = (type === 'arabic' ? b.userNameAr : b.userName) || '';

          return collator.compare(nameA.trim(), nameB.trim());
        })
      )

    ).subscribe(sorted => {

      const sheetData = sorted.map(item => ({
        userNameEn: item.userName,
        userNameAr: item.userNameAr,
        department: item.department,
        userImage: item.userImage,
      }));

      const worksheet = XLSX.utils.json_to_sheet(sheetData);

      const workbook: XLSX.WorkBook = {
        Sheets: { data: worksheet },
        SheetNames: ['data']
      };

      const buffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      const blob = new Blob([buffer], {
        type: 'application/octet-stream'
      });

      saveAs(blob, `all-data-sorted-${type}.xlsx`);
    });
  }

  // Download Seat No. Sheet
  downloadSeatNumbers(): void {

    const finalData = this.allBooking.map((booking: any) => {

      // يجيب كرسي الـ owner أو أول QR
      const ownerQr = booking.qrs?.find((q: any) => q.type === 'owner');

      return {
        'Seat No.': ownerQr?.seatNumber || booking.qrs?.[0]?.seatNumber || '',
        'Name': booking.userName,
        'OutComers': (booking.defaultVisitorCount || 0) + (booking.VisitorCount || 0)
      };

    });

    // ترتيب حسب رقم الكرسي
    finalData.sort((a, b) =>
      a['Seat No.'].localeCompare(
        b['Seat No.'],
        undefined,
        { numeric: true }
      )
    );

    const worksheet = XLSX.utils.json_to_sheet(finalData);

    const workbook: XLSX.WorkBook = {
      Sheets: {
        Seats: worksheet
      },
      SheetNames: ['Seats']
    };

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    saveAs(
      new Blob([buffer], {
        type: 'application/octet-stream'
      }),
      `${this.eventData?.EventName}-Seat-Numbers.xlsx`
    );
  }

  // Download All Images
  async downloadAllImages(): Promise<void> {
    const zip = new JSZip();
    const folder = zip.folder('event-images');

    for (let i = 0; i < this.allBooking.length; i++) {
      const user = this.allBooking[i];

      if (!user.userImage) continue;

      try {
        const response = await fetch(user.userImage);
        const blob = await response.blob();

        const ext =
          user.userImage.split('.').pop()?.split('?')[0] || 'jpg';

        // 🔥 تنظيف الاسم عشان ما يكسرش filename
        const safeName = (user.userName || `user-${i + 1}`)
          .replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '')
          .trim()
          .replace(/\s+/g, '_');

        folder?.file(`${safeName}.${ext}`, blob);

      } catch (err) {
        console.log('failed:', user.userName);
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });

    saveAs(content, 'event-images.zip');
  }


  // Update All Bookings Departments
  private firestore = inject(Firestore);

  async updateDepartments() {
    const batch = writeBatch(this.firestore);

    this._NgxSpinnerService.show();

    this.filteredData.forEach((booking) => {
      const bookingRef = doc(this.firestore, `bookings/${booking.id}`);

      batch.update(bookingRef, {
        department:
          booking.status === 'Pending'
            ? 'Chinese'
            : 'Chinese Credit',
      });
    });

    try {
      await batch.commit();
      this._ToastrService.success('All bookings updated successfully');
    } catch (err) {
      console.error(err);
      this._ToastrService.error('Update Booking Failed');
    } finally {
      this._NgxSpinnerService.hide();
    }
  }
}
