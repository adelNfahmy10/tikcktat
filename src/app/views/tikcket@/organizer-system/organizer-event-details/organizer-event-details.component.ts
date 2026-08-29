import { CommonModule, DatePipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '@core/services/booking/booking.service';
import { EventService } from '@core/services/event/event.service';
import { UsersService } from '@core/services/users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-organizer-event-details',
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './organizer-event-details.component.html',
  styleUrl: './organizer-event-details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrganizerEventDetailsComponent {
  private readonly _UsersService = inject(UsersService)
  private readonly _EventService = inject(EventService)
  private readonly _BookingService = inject(BookingService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)
  private readonly _ToastrService = inject(ToastrService)

  adminId:string | null = localStorage.getItem('userId');

  eventData:any
  eventId:string = ''

  ownerId:string = ''
  ownerData:any = {}

  allBooking:any[] = []
  totalTickets:number = 0
  totalOutComerCount:number = 0
  totalVisitorCount:number = 0
  totalDefaultVisitorCount:number = 0
  totalRevenue:number = 0
  totalNewOutcomersPrice:number = 0

  ngOnInit(): void {
    this.getEventById()
    this.getAllBooking()
  }

  getEventById(): void {
    this._NgxSpinnerService.show()
    this._ActivatedRoute.paramMap
      .pipe(
        switchMap(params => {
          this.eventId = params.get('id')!;
          return this._EventService.getEventById(this.eventId);
        }),
      )
      .subscribe({
        next: (res) => {
        this._NgxSpinnerService.hide()
          this.eventData = res;
          console.log(this.eventData);

          this.getOwnerById()
        },
        error: (err) => {
          this._NgxSpinnerService.hide()
          console.error(err);
        }
      });
  }

  getAllBooking(){
    this._NgxSpinnerService.show()

    this._BookingService.getBookingsByEvent(this.eventId).subscribe({
      next:(res)=>{
        this._NgxSpinnerService.hide()
        this.allBooking = res
        this.totalTickets = this.allBooking.length

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

        // 💰 total new outcomers amount
        this.totalNewOutcomersPrice = this.allBooking.reduce(
          (total, booking) =>
            total +
            (booking.newOutcomers || []).reduce(
              (sum:any, outcomer:any) => sum + Number(outcomer.price || 0),
              0
            ),
          0
        );

        // 💰 total revenue
        this.totalRevenue = this.allBooking.reduce((sum, item) => sum + (item.totalAmount || 0), 0);

      },
      error:(err)=>[
        this._NgxSpinnerService.hide()
      ]
    })
  }

  getOwnerById():void{
    this._NgxSpinnerService.show()
    let ownerId = this.eventData?.OwnerId
    this._UsersService.getUserById(ownerId).subscribe({
      next:(res)=>{
        this._NgxSpinnerService.hide()
        this.ownerData = res
      },
      error:(err)=>[
        this._NgxSpinnerService.hide()
      ]
    })
  }

  addPolicyInEvent(): void {
    const eventPolicy = {
      ar: [
        "جميع المبالغ المدفوعة لهذا الحدث غير قابلة للاسترداد تحت أي ظرف من الظروف.",
        "التذكرة صالحة فقط لحضور حفل التخرج المحدد ولا يمكن استبدالها أو استخدامها في أي فعالية أخرى.",
        "في حالة عدم الحضور أو التأخر عن موعد الحفل، لن يتم استرداد أي مبالغ أو تقديم أي تعويض.",
        "في حال تأجيل الحفل لأسباب خارجة عن إرادة الجهة المنظمة، تظل جميع الحجوزات والتذاكر سارية للموعد الجديد.",
        "يتحمل المشارك مسؤولية صحة جميع البيانات الشخصية المدخلة أثناء عملية الحجز.",
        "تحتفظ الجهة المنظمة بحقها في إجراء تعديلات معقولة على جدول الحفل أو أماكن الجلوس أو برنامج الفعالية عند الحاجة.",
        "يحق للجهة المنظمة استبعاد أي شخص يخالف قواعد المكان أو يتسبب في أي سلوك غير لائق دون أحقية في استرداد أي مبالغ.",
        "بإتمام عملية الحجز، يقر المشارك بأنه قد قرأ ووافق على جميع الشروط والأحكام والسياسات الخاصة بالفعالية."
      ],
      en: [
        "All payments made for this event are non-refundable under any circumstances.",
        "This ticket is valid only for the specified graduation ceremony and cannot be exchanged or used for any other event.",
        "No refunds or compensation will be provided in the event of absence or late arrival to the ceremony.",
        "If the event is postponed due to circumstances beyond the organizer's control, all reservations and tickets will remain valid for the rescheduled date.",
        "The participant is responsible for ensuring that all personal information provided during the booking process is accurate.",
        "The organizer reserves the right to make reasonable changes to the event schedule, seating arrangements, or program whenever necessary.",
        "The organizer reserves the right to remove any participant who violates the venue rules or engages in inappropriate behavior, without any entitlement to a refund.",
        "By completing the reservation, the participant acknowledges that they have read and agreed to all the terms, conditions, and event policies."
      ]
    };

    this._EventService.updateEvent(this.eventId, {
      policy: eventPolicy
    }).subscribe({
      next: () => {
        this._ToastrService.success('Event policy added successfully.');
      },
      error: (err) => {
        console.error(err);
        this._ToastrService.error('Error updating event.');
      }
    });
  }

  addExtraOutcomers(): void {
    let eventExtraOutcomers = 0

    if(this.eventId == 'k2vYgk5ekOaZLp7y3x1U' || this.eventId == 'Nu2hA9IFF5XoAiIDKCKl'){
      eventExtraOutcomers = 70
    } else if(this.eventId == '0fSZiTjFyiz5TL3Bg5xR'){
      eventExtraOutcomers = 60
    } else if(this.eventId == '6KBIPOyo0rK8A3TVad90' || this.eventId == '6t29w3KUr793N6eJ93Ih'){
      eventExtraOutcomers = 45
    } else if(this.eventId == 'seXCdBgEahwpuXnnU0gX'){
      eventExtraOutcomers = 20
    } else {
      this._ToastrService.error('Event Have not any extra outcomer.');
      return;
    }

    this._EventService.updateEvent(this.eventId, {
      ExtraOutcomers: eventExtraOutcomers
    }).subscribe({
      next: () => {
        this._ToastrService.success('Extra Outcomers added successfully.');
        this.getEventById()
      },
      error: (err) => {
        console.error(err);
        this._ToastrService.error('Error add extra outcomers.');
      }
    });
  }

  get eventDetailsList(): string[] {
    if (!this.eventData?.EventDetails) return [];
    return this.eventData.EventDetails
      .split('\r\n')          // نفصل كل سطر
      .map((item:any) => item.trim()) // نشيل أي فراغات
      .filter((item:any) => item);    // نشيل أي عناصر فاضية
  }

  get termsList(): string[] {
    if (!this.eventData?.TermsOfEntries) return [];
    return this.eventData.TermsOfEntries
      .split('\r\n')          // نفصل كل شرط على سطر
      .map((item:any) => item.trim()) // نشيل أي فراغات
      .filter((item:any) => item);    // نشيل أي عناصر فاضية
  }
}
