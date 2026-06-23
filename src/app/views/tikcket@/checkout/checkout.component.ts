import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '@core/services/booking/booking.service';
import { EventService } from '@core/services/event/event.service';
import { UsersService } from '@core/services/users/users.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { arrayUnion } from 'firebase/firestore';
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { generate } from 'rxjs';
import { SendmailService } from '@core/services/send-email/sendmail.service';

export interface Seat {
  id: string;
  number: number;
  status: 'available' | 'booked' | 'selected';
}

export interface Block {
  name: string;
  seats: Seat[];
}

export interface Row {
  name: string;
  blocks: Block[];
}

export interface Category {
  id: string;
  name: string;
  price: number;
  rows: Row[];
}

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink, DropzoneModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private readonly _UsersService = inject(UsersService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _Router = inject(Router)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _EventService = inject(EventService)
  private readonly _BookingService = inject(BookingService)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)
  private readonly _SendmailService = inject(SendmailService)
  private modalService = inject(NgbModal)

  userId:string | null = localStorage.getItem('userId') || null
  userData:any = {}
  eventData:any = {}
  eventId:string | null = null
  transactionRef:string = ''

  selectedFile!: File | null;
  photoPreview: string | ArrayBuffer | null = null;
  selectedPaymentFile!: File | null;
  paymentImagePreview: string | ArrayBuffer | null = null;
  checkoutData:any = {}
  subTotal:number = 0
  total:number = 0
  tax:number = 0.02

  isReturningUser:boolean = false
  visitorCount:number = 0
  paidTwo:number = 0
  bookingData: any = null;

  allBookings:any[] = []
  validStudentIds:number[] = [
    4000101, 4000102, 4000103, 4000104, 4000105, 4000106, 4000107, 4000108, 4000110,
    4000111, 4000112, 4000113, 4000114, 4000115, 4000116, 4000117, 4000118, 4000119,
    4000120, 4000121, 4000122, 4000123, 4000124, 4000126, 4000127, 4000128, 4000130,
    4000131, 4000132, 4000125, 4000109, 4000129,

    6000100,6000101,6000102,6000103,6000104,6000105,6000106,6000107,6000108,6000109,
    6000110,6000111,6000112,6000113,6000114,6000115,6000116,6000117,6000118,6000119,
    6000120,6000121,6000122,6000123,6000124,6000125,6000126,6000127,6000128,6000129,
    6000130,6000131,6000132,6000133,6000134,6000135,6000136,6000137,6000138,6000139,
    6000140,

    7000200,7000201,7000202,7000203,7000204,7000205,7000206,7000207,7000208,7000209,
    7000210,7000211,7000212,7000213,7000214,7000215,7000216,7000217,7000218,7000219,
    7000220,7000221,7000222,7000223,7000224,7000225,7000226,7000227,7000228,7000229,
    7000230,7000231,7000232,7000233,7000234,7000235,7000236,7000237,7000238,7000239,
    7000240,

    8000300,8000301,8000302,8000303,8000304,8000305,8000306,8000307,8000308,8000309,
    8000310,8000311,8000312,8000313,8000314,8000315,8000316,8000317,8000318,8000319,
    8000320,8000321,8000322,8000323,8000324,8000325,8000326,8000327,8000328,8000329,
    8000330,8000331,8000332,8000333,8000334,8000335,8000336,8000337,8000338,8000339,
    8000340,8000341,8000342,8000343,8000344,8000345,8000346,8000347,8000348
  ];
  bookedStudentIds:number[] = []


  ngOnInit(): void {
    this.getEventId();
    this.getUserById();
    this.getAllBookings();
    // this.generateLayout();


    // Confirance / Exhibitions Section
    this.conferenceForm.get('industry')?.valueChanges.subscribe(value => {

      if (value === 'Other') {

        this.industry = true;

        this.conferenceForm.get('otherIndustry')?.setValidators([
          Validators.required,
          Validators.minLength(2)
        ]);

      } else {

        this.industry = false;

        this.conferenceForm.get('otherIndustry')?.clearValidators();
        this.conferenceForm.get('otherIndustry')?.reset();

      }

      this.conferenceForm.get('otherIndustry')?.updateValueAndValidity();
    });
  }

  getEventId(): void {
    this._NgxSpinnerService.show()

    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        this.eventId = params.get('id')!;

        this._EventService.getEventById(this.eventId).subscribe({
          next: (res) => {
            this.eventData = res;
            this.eventData.departments = (this.eventData.departments || []).filter((d:any) => d && d.trim().length > 0);
            this._NgxSpinnerService.hide()
          }
        });

        // 🔥 check هنا مباشرة
        this._BookingService.checkUserBooking(this.eventId, this.userId!).subscribe((booking) => {
          this._NgxSpinnerService.hide()

          if (booking) {
            this.isReturningUser = true;
            this.bookingData = booking;
            this.calculateFinalPaid()
          } else {
            this.isReturningUser = false;
          }

        });
      }
    });
  }

  getUserById():void{
    this._NgxSpinnerService.show()
    this.userId = localStorage.getItem('userId')

    if (!this.userId) {
      this._NgxSpinnerService.hide();
      this._ToastrService.error('User not found');
      localStorage.clear()
      this._Router.navigate(['/']).then(() => {
        window.location.reload();
      });
      return;
    }

    this._UsersService.getUserById(this.userId!).subscribe({
      next:(res)=>{
        this.userData = res

        if (!this.userData) {
          this._NgxSpinnerService.hide();
          this._ToastrService.error('User not found');
          localStorage.clear();
          this._Router.navigate(['/']).then(() => {
            window.location.reload();
          });
          return;
        }

        this._NgxSpinnerService.hide()
      },
      error: () => {
        this._NgxSpinnerService.hide();
        localStorage.clear()
        this._ToastrService.error('User not found');
        this._Router.navigate(['/']).then(() => {
          window.location.reload();
        });
      }
    })
  }

  getAllBookings():void{
    this._BookingService.getAllBookings().subscribe({
      next:(res)=>{
        this.allBookings = res;
        // فلترة على نفس الـ event + استخراج IDs
        this.bookedStudentIds = this.allBookings
          .filter(b => b.EventId === this.eventId)
          .map(b => Number(b.studentsIDs))
          .filter(id => !isNaN(id));
        }
    })
  }

  checkoutForm:FormGroup = this._FormBuilder.group({
    EventId:[null, Validators.required],
    EventName:[null, Validators.required],
    OwnerId:[null, Validators.required],

    studentsIDs:[null],
    userId:[null, Validators.required],
    userName:[null, Validators.required],
    userNameAr:[null, Validators.required],
    userPhone:[null, Validators.required],
    userEmail:[null, Validators.required],
    userImage:[null],
    GraduationScarfName:[
      null,
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]
    ],
    department:[null],
    defaultVisitorCount:[null, [Validators.required, Validators.min(0)]],
    VisitorCount:[null, [Validators.required, Validators.min(0)]],

    payOneAmount:[null],
    payOneImage:[null],
    payOneRef:[null, [Validators.pattern(/^[0-9]{12}$/)]],

    payTwoAmount:[null],
    payTwoImage:[null],
    payTwoRef:[null, [Validators.pattern(/^[0-9]{12}$/)]],

    totalAmount:[null, [Validators.required, Validators.min(0)]],
    qrs:[null, [Validators.required, Validators.min(0)]],
  })

  MsgErr:string = ''

  // Modal Check Data Logic
  openModal(content: TemplateRef<HTMLElement>, options: NgbModalOptions) {
    if(this.userData.fullName && this.userData.phone && this.userData.email){
      this.modalService.open(content, options)
      this.checkoutData = this.checkoutForm.value
      let price  = this.eventData?.TicketPrice
      let companionPrice  = this.checkoutData?.VisitorCount * this.eventData?.VisitorPrice
      // this.subTotal = price + companionPrice
      this.subTotal = this.eventData?.deposit

      // الضريبة 2.7% من الإجمالي + 23 ثابت
      this.tax = Math.ceil((this.subTotal * 0.020)) ;
      // الإجمالي النهائي
      this.total = this.subTotal + this.tax;
    } else {
      this._ToastrService.error('Faild To Cntinue')
    }
  }

  // Checkout Logic
  async submitCheckout(): Promise<void> {
    this._NgxSpinnerService.show()
    const studentId = Number(this.checkoutForm.get('studentsIDs')?.value);

    // ✅ Validate Event ID
    if (!this.eventId) {
      this._ToastrService.error('الحفلة غير موجودة');
      this.MsgErr = 'الحفلة غير موجودة'
      this._NgxSpinnerService.hide()

      return;
    }

    // ✅ Validate Scarf Name
    if (!this.checkoutForm.get('GraduationScarfName')?.value) {
      this._ToastrService.error('برجاء إدخال الإسم على الوشاح');
      this.MsgErr = 'برجاء إدخال الإسم على الوشاح'
      this._NgxSpinnerService.hide()

      return;
    }

    // ✅ Validate Department
    const hasDepartments = this.eventData?.departments?.length > 0;
    if (hasDepartments && !this.checkoutForm.get('department')?.value) {
      this._ToastrService.error('برجاء أدخل القسم');
      this.MsgErr = 'برجاء أدخل القسم'
      this._NgxSpinnerService.hide();
      return;
    }

    // ✅ Validate Your Photo
    if (!this.selectedFile) {
      this._ToastrService.error('برجاء رفع صورتك الخاصة بالحفل');
      this.MsgErr = 'برجاء رفع صورتك الخاصة بالحفل'
      this._NgxSpinnerService.hide()

      return;
    }

    // ✅ Validate Payment Image
    if (!this.selectedPaymentFile) {
      this._ToastrService.error('برجاء رفع صورة الدفع');
      this.MsgErr ='برجاء رفع صورة الدفع'
      this._NgxSpinnerService.hide()
      return;
    }

    // ✅ Validate Student ID In List
    if (this.eventId === 'uvoo0zHQzwK1efCTBynh') {

      // ✅ موجود في الليستة الأساسية
      if (!this.validStudentIds.includes(studentId)) {
        this._ToastrService.error('الـ ID غير صحيح');
        this.MsgErr = 'الـ ID غير صحيح'
        this._NgxSpinnerService.hide();
        return;
      }

      // ✅ متحجز قبل كدا
      if (this.bookedStudentIds.includes(studentId)) {
        this._ToastrService.error('تم استخدام هذا الـ ID من قبل');
        this.MsgErr = 'تم استخدام هذا الـ ID من قبل'
        this._NgxSpinnerService.hide();
        return;
      }

    }

    // ✅ Validate Student IDs
    if(this.eventId == 'HLz7HiRkpk33TSvFDNGy' || this.eventId == 'uvoo0zHQzwK1efCTBynh'){
      if (!this.checkoutForm.get('studentsIDs')?.value) {
        this._ToastrService.error('برجاء أدخل (ID) الخاص بك');
        this.MsgErr = 'برجاء أدخل (ID) الخاص بك'
        this._NgxSpinnerService.hide()

        return;
      }
    }


    try {
      this._NgxSpinnerService.show()

      // 🔥 2. Upload image
      const imageUrl = await this._EventService.uploadImage(this.selectedFile);
      const imagePaymentUrl = await this._EventService.uploadImage(this.selectedPaymentFile!);

      if (!imageUrl || !imagePaymentUrl) {
        this._ToastrService.error('Upload failed');
        return;
      }

      const formValue = this.checkoutForm.value;

      const finalData = {
        ...formValue,
        EventId: this.eventId,
        EventName: this.eventData.EventName,
        OwnerId: this.eventData.OwnerId,

        userId: this.userId,
        userName: this.userData.fullName,
        userNameAr: this.userData.fullNameAr || this.userData.fullName,
        userPhone: this.userData.phone,
        userEmail: this.userData.email,
        userImage: imageUrl,
        defaultVisitorCount: 2,
        VisitorCount: null,

        payOneAmount: 0,
        payOneImage: imagePaymentUrl,
        payOneRef: this.transactionRef,
        createdAtOne: new Date(),

        payTwoAmount: 0,
        payTwoImage: '',
        payTwoRef: '',
        createdAtTwo: '',
        totalAmount: 0,
        status: 'Pending'
      };

      // 🔥 1. Save booking
      this._BookingService.createBooking(finalData).subscribe({
        next: () => {
          this._NgxSpinnerService.hide()

          // 🔥 2. Update tickets
          this._EventService.updateEventTickets(
            this.eventId!,
            1
          ).subscribe();

          this.checkoutForm.reset();
          this.tax = 0
          this.subTotal = 0
          this.total = 0
          this.transactionRef = ''
          this.selectedFile = null
          this.selectedPaymentFile = null
          this.photoPreview = ''
          this.paymentImagePreview = ''
          this.checkoutData = {}
          this._ToastrService.success('Booking Created Successfully');
          this.modalService.dismissAll();
          this._Router.navigate(['/payment-success'])
        },
        error: () => {
          this._NgxSpinnerService.hide()
          this._ToastrService.error('Booking Failed');
        }
      });

    } catch (err) {
      this._NgxSpinnerService.hide()
      this._ToastrService.error('Checkout failed');
    }
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.photoPreview = reader.result;
    };

    reader.readAsDataURL(this.selectedFile);
  }

  onPaymentImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    this.selectedPaymentFile = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.paymentImagePreview = reader.result;
    };

    reader.readAsDataURL(this.selectedPaymentFile);
  }

  payOneNetForView:number = 0
  // View Final Payment Checkout
  calculateFinalPaid():void{
    if (!this.isReturningUser) return;

      // 1. اللي اتدفع قبل كده (gross → net)
      const payOneGross = this.bookingData?.payOneAmount || 0;
      const payOneNet = Math.floor(payOneGross / 1.02);
      this.payOneNetForView = Math.floor(payOneNet);

      // 2. حساب التذكرة المتبقية
      const ticketRemaining = this.eventData.TicketPrice - payOneNet;

      // 4. subtotal الحقيقي
      this.subTotal = ticketRemaining;

      // 5. fees على اللي هيتدفع دلوقتي بس
      this.tax = this.subTotal * 0.02;

      // 6. الإجمالي
      this.total = this.subTotal + this.tax;

      // optional rounding في الآخر
      this.subTotal = Math.floor(this.subTotal);
      this.tax = Math.floor(this.tax);
      this.total = Math.floor(this.total);
  }

  // View Visitors Count Price
  calculateVisitorsPrice(): void {
    if (!this.isReturningUser) return;

    // 3. حساب المرافق (Net كامل مش fees)
    const visitorsNet = this.eventData.VisitorPrice * this.visitorCount;

    this.subTotal = visitorsNet

    // 5. fees على اللي هيتدفع دلوقتي بس
    this.tax = this.subTotal * 0.02;

    // 6. الإجمالي
    this.total = this.subTotal + this.tax;

    // optional rounding في الآخر
    this.subTotal = Math.floor(this.subTotal);
    this.tax = Math.floor(this.tax);
    this.total = Math.floor(this.total);
  }

  async continueBooking() {
    this._NgxSpinnerService.show();

    if (!this.selectedPaymentFile) {
      this._ToastrService.error('برجاء رفع صورة الدفع');
      this.MsgErr = 'برجاء رفع صورة الدفع'
      this._NgxSpinnerService.hide()

      return;
    }
    if (this.isReturningUser) {
      this.MsgErr = ''
      const imagePaymentUrl = await this._EventService.uploadImage(this.selectedPaymentFile!);

      // 🔥 Generate QRs
      const totalPersons = this.bookingData.defaultVisitorCount + 1;
      const qrs = this.generateQRs(totalPersons, this.bookingData.id);

      this._BookingService.updateBooking(this.bookingData.id, {
        // VisitorCount: this.visitorCount,
        // totalVisitors: this.visitorCount + this.bookingData.defaultVisitorCount,
        payTwoAmount: 0,
        payTwoImage: imagePaymentUrl,
        payTwoRef: this.transactionRef,
        createdAtTwo: new Date(),

        totalReq: this.total,

        // ✅ الجزء الجديد
        qrs: qrs,
        qrsGenerated: true
      }).subscribe({
        next: () => {
          this._NgxSpinnerService.hide();
          this._ToastrService.success('Booking Completed Successfully');
          this._ToastrService.success('Booking Completed Successfully');

          // reset
          this.transactionRef = '';
          this.selectedFile = null;
          this.selectedPaymentFile = null;
          this.photoPreview = '';
          this.paymentImagePreview = '';
          this.checkoutData = {};

          this.modalService.dismissAll();
          this._Router.navigate(['/payment-success']);
        },
        error: (err) => {
          this._NgxSpinnerService.hide();
          this._ToastrService.error('Update Failed');
        }
      });
    }
  }

  newOutComerCount:number = 0
  async addOutComer() {
    this._NgxSpinnerService.show();
    const imagePaymentUrl = await this._EventService.uploadImage(this.selectedPaymentFile!);
    const newVisitor = {
      type: 'outcomer',
      count: this.newOutComerCount,
      price: 0,
      payRef: this.transactionRef,
      payImage: imagePaymentUrl,
      createdAt: new Date()
    };

    let totalPersons = this.newOutComerCount + this.bookingData.VisitorCount;
    const newQRs = this.generateGuestQRs(this.newOutComerCount, this.bookingData.id);

    this._BookingService.updateBooking(this.bookingData.id, {
      VisitorCount: totalPersons,
      newOutcomers: arrayUnion(newVisitor),
      totalVisitors: totalPersons + this.bookingData.defaultVisitorCount,

      // ✅ الجزء الجديد
      qrs: arrayUnion(...newQRs),
      qrsGenerated: true
    }).subscribe({
      next: () => {
        this._NgxSpinnerService.hide();
        this._ToastrService.success('✅ Add Outcomer Successfully');
        this.modalService.dismissAll();
        this._Router.navigate(['/payment-success']);
      },
      error: () => {
        this._NgxSpinnerService.hide();
        this._ToastrService.error('Update Failed');
      }
    });
  }

  generateQRs(totalPersons: number, bookingId: string) {
    const qrs = [];

    for (let i = 0; i < totalPersons; i++) {
      qrs.push({
        id: `${bookingId}_${this.generateUUID()}`,
        isUsed: false,
        type: i === 0 ? 'owner' : 'guest',
        seatNumber: null,
        createdAt: new Date()
      });
    }

    return qrs;
  }

  generateGuestQRs(totalPersons: number, bookingId: string) {
    const qrs = [];

    for (let i = 0; i < totalPersons; i++) {
      qrs.push({
        id: `${bookingId}_${this.generateUUID()}`,
        isUsed: false,
        type: 'guest',
        seatNumber: null,
        createdAt: new Date()
      });
    }

    return qrs;
  }

  generateUUID() {
    return 'xxxxxxx'.replace(/[x]/g, () =>
      ((Math.random() * 36) | 0).toString(36)
    );
  }

  scrollToBookNow() {
    const el = document.getElementById('bookNowSection');

    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }



  // Conference Login

  industryOptions:string[] = [
    'Technology',
    'Software Development',
    'Artificial Intelligence',
    'Cyber Security',
    'Finance',
    'Banking',
    'Healthcare',
    'Education',
    'Marketing',
    'Real Estate',
    'Manufacturing',
    'Telecommunications',
    'Government',
    'Other'
  ]

  industry:boolean = false

  conferenceForm: FormGroup = this._FormBuilder.group({
    jobTitle: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    companyName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    industry: [null, [Validators.required, Validators.pattern(new RegExp(`^(${this.industryOptions.join('|')})$`))]],
    otherIndustry: [null, [Validators.minLength(3), Validators.maxLength(100)]],
    linkedInUrl: [null, [Validators.pattern(/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/)]],
  })

  async conferenceSubmit(): Promise<void> {
    let data = this.conferenceForm.value;
    const imageUrl = await this._EventService.uploadImage(this.selectedFile!);

    const finalData = {
      ...data,
      EventId: this.eventId,
      EventName: this.eventData.EventName,
      OwnerId: this.eventData.OwnerId,

      userId: this.userId,
      userName: this.userData.fullName,
      userNameAr: this.userData.fullNameAr || this.userData.fullName,
      userPhone: this.userData.phone,
      userEmail: this.userData.email,
      userImage: imageUrl,
      createdAt: new Date(),
    };

    this._BookingService.createBooking(finalData).subscribe({
      next: (res) => {
        let qrCode = this.generateQRs(1, res.id) // Generate QR for conference booking

        this._BookingService.updateBooking(this.bookingData.id, {
          qrs: qrCode,
          qrsGenerated: true
        }).subscribe({
          next: () => {
            this._NgxSpinnerService.hide();
            this._ToastrService.success('Booking Completed Successfully');
            this.conferenceForm.reset()
            this.selectedFile = null
            this.photoPreview = null
            this.sendConfirmEmail(finalData?.userEmail, finalData?.EventName,finalData?.userName, qrCode[0].id)



            this.modalService.dismissAll();
            this._Router.navigate(['/payment-success']);
          },
          error: (err) => {
            this._NgxSpinnerService.hide();
            this._ToastrService.error('Booking Failed');
          }
        });
      },
      error: (err) => {
        this._ToastrService.error('Submission Failed');
      }
    });

  }

  // SMTP Bravo
  sendConfirmEmail(email:string, eventName:string, userName:string, qrId:string):void{
    let data = {
      to: email,
      userName: userName,
      eventName: eventName,
      qrLink: `https://www.ticketateg.com/#/qrcode/${qrId}`
    }

    this._SendmailService.sendConfiranceEmail(data).subscribe({
      next: (res) => {
        this._ToastrService.success('Email Sent');
      },
      error: (err) => {
        this._ToastrService.warning('Email failed !');
      }
    });
  }





































  // // Seating Layout Logic
  // categories: Category[] = [];
  // selectedSeats: Seat[] = [];

  // generateLayout(): void {
  //   const config = [
  //     { id:'vip', name:'VIP', rows:5, blocks:3, seatsPerBlock:6, price:500 },
  //     { id:'regular', name:'Regular', rows:8, blocks:2, seatsPerBlock:10, price:250 },
  //     { id:'balcony', name:'Balcony', rows:4, blocks:4, seatsPerBlock:5, price:150 }
  //   ];

  //   let globalRowIndex = 0; // لتسلسل الحروف بين كل categories

  //   config.forEach(cat => {

  //     const rows: Row[] = [];

  //     for (let r = 0; r < cat.rows; r++) {

  //       const rowLetter = String.fromCharCode(65 + globalRowIndex);
  //       globalRowIndex++;

  //       const blocks: Block[] = [];
  //       let seatNumber = 1; // كل صف رقم يبدأ من 1 ويكمل عبر كل blocks

  //       for (let b = 0; b < cat.blocks; b++) {

  //         const seats: Seat[] = [];

  //         for (let s = 1; s <= cat.seatsPerBlock; s++) {
  //           seats.push({
  //             id: `${rowLetter}${seatNumber++}`, // رقم متسلسل عبر كل الصف
  //             number: seatNumber - 1,
  //             status: Math.random() > 0.9 ? 'booked' : 'available'
  //           });
  //         }

  //         blocks.push({ name:`B${b+1}`, seats });
  //       }

  //       rows.push({ name: rowLetter, blocks });
  //     }

  //     this.categories.push({
  //       id: cat.id,
  //       name: cat.name,
  //       price: cat.price,
  //       rows
  //     });

  //   });
  // }

  // toggleSeat(seat: Seat) {
  //   if (seat.status === 'booked') return;

  //   if (seat.status === 'selected') {
  //     seat.status = 'available';
  //     this.selectedSeats =
  //       this.selectedSeats.filter(s => s.id !== seat.id);
  //   } else {
  //     seat.status = 'selected';
  //     this.selectedSeats.push(seat);
  //   }
  // }
}
