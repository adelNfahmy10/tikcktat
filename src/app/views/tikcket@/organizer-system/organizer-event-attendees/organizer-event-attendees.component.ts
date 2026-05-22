import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  private readonly _DownloadExcelService = inject(DownloadExcelService)
  private readonly _Router = inject(Router)
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
  // #################### Check Change Any Data in LocalStorage ####################


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

  totalOutComerCount:number = 0
  totalVisitorCount:number = 0
  totalDefaultVisitorCount:number = 0
  totalRevenue:number = 0
  totalTaxes:number = 0
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

          this.totalTaxes = Math.ceil(this.totalRevenue * 0.02);

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

    this.hasDepartmentColumn = this.attendeesWithUsers.some(
      a => a.department != null
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
            this.sendEmailToUser(this.bookDataById?.userEmail, this.bookDataById?.EventName,this.bookDataById?.userName)
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
              id: item.id,
              department: item.department,
              userImage: item.userImage || '',
              userName: item.userName,
              userNameAr: user?.fullNameAr || '',
              userPhone: item.userPhone,
              userEmail: item.userEmail,
              ScarfName: item.GraduationScarfName,
              status: item.status,
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

  // Download Sort Name Sheet By Departments
  downloadAllDepartmentsSorted(type: 'arabic' | 'english'): void {

    const departments = this.eventData?.departments || [];

    departments.forEach((dept: string) => {

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
              userNameAr: user?.fullNameAr || item.userName,
              userName: item.userName,
              department: item.department,
            }))
          )
        ),

        toArray(),

        map(list => {

          return list.sort((a, b) => {

            const nameA = type === 'arabic' ? a.userNameAr : a.userName;
            const nameB = type === 'arabic' ? b.userNameAr : b.userName;

            return (nameA || '').localeCompare(
              nameB || '',
              type === 'arabic' ? 'ar' : 'en'
            );
          });

        })

      ).subscribe(sorted => {

        const sheetData = sorted.map(item => ({
          userNameAr: item.userNameAr,
          userName: item.userName,
          department: item.department,
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

  // Download Seat No. Sheet
  downloadDepartmentsWithSeatNumber(): void {

    const departments = this.eventData?.departments || [];

    const prefixMap: { [key: string]: string } = {};
    let charCode = 65;

    departments.forEach((dept: string) => {
      prefixMap[dept.trim().toLowerCase()] = String.fromCharCode(charCode++);
    });

    departments.forEach((dept: string) => {

      const deptClean = dept.trim().toLowerCase();
      const prefix = prefixMap[deptClean] || '';

      const deptData = this.allBooking.filter(b =>
        (b.department || '').trim().toLowerCase() === deptClean
      );

      if (!deptData.length) return;

      from(deptData).pipe(

        mergeMap(item =>
          this._UsersService.getUserById(item.userId).pipe(
            take(1),
            map(user => {

              const outComers =
                (item?.defaultVisitorCount || 0) +
                (item?.VisitorCount || 0);

              return {
                id: item.id,
                userName: user?.fullName || item.userName,
                outComers: outComers
              };
            })
          )
        ),

        toArray(),

        map(list => {

          let counter = 1;

          return list.map(item => ({
            'Seat No.': `${prefix}${counter++}`,
            userName: item.userName,
            OutComers: item.outComers,
          }));
        })

      ).subscribe(finalData => {

        const worksheet = XLSX.utils.json_to_sheet(finalData);

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

        saveAs(blob, `${dept}-seat-order.xlsx`);
      });

    });
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
}
