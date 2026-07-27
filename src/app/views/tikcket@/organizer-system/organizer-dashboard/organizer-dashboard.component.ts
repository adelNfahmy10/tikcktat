import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartOptions } from '@common/apexchart.model';
import { BookingService } from '@core/services/booking/booking.service';
import { EventService } from '@core/services/event/event.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-organizer-dashboard',
  imports: [DecimalPipe,NgApexchartsModule, NgbDropdownModule, CommonModule],
  templateUrl: './organizer-dashboard.component.html',
  styleUrl: './organizer-dashboard.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrganizerDashboardComponent implements OnInit{
  private readonly _EventService = inject(EventService)
  private readonly _BookingService = inject(BookingService)
  private readonly _ActivatedRoute = inject(ActivatedRoute)

  OwnerId:string = ''
  allEvents:any[] = []
  allBookings:any[] = []
  eventsCount:number = 0
  eventsActiveCount:number = 0
  eventsInactiveCount:number = 0

  BookingsCount:number = 0
  BookingsAmount:number = 0
  BookingsPending:number = 0
  BookingsParPaid:number = 0
  BookingsPaid:number = 0

  OutcomersCount:number = 0
  defualtOutcomersCount:number = 0
  newOutcomersCount:number = 0
  BookingsOutcomersAmount:number = 0

  totalAmount:number = 0

  topCustomers:any[] = []
  topEvents:any[] = []

  ngOnInit(): void {
    this.getAllEvents()
    this.getAllBookings()
  }

  getAllEvents():void{
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        this.OwnerId = params.get('id') || localStorage.getItem('userId')!
        this._EventService.getAllEvents().subscribe({
          next:(res)=>{
            this.allEvents = res.filter((event: any) => event.OwnerId === this.OwnerId);
            this.eventsCount = this.allEvents.length;
            console.log(this.allEvents);

            this.eventsActiveCount = this.allEvents.filter((event: any) => event.status == 'Active').length
            this.eventsInactiveCount = this.allEvents.filter((event: any) => event.status != 'Active').length
          }
        })
      }
    })
  }

  getAllBookings():void{
    this._BookingService.getAllBookings().subscribe({
      next:(res)=>{
        this.allBookings = res.filter((event: any) => event.OwnerId === this.OwnerId);
        const bookingCounts = this.allBookings.reduce(
          (acc: any, book: any) => {
            switch (book.status) {
              case 'Pending':
                acc.pending++;
                break;
              case 'Par-Paid':
                acc.parPaid++;
                break;
              case 'Paid':
                acc.paid++;
                break;
            }
            return acc;
          },
          {
            pending: 0,
            parPaid: 0,
            paid: 0,
          }
        );

        console.log(this.allBookings);


        this.BookingsPending = bookingCounts.pending;
        this.BookingsParPaid = bookingCounts.parPaid;
        this.BookingsPaid = bookingCounts.paid;

        this.BookingsCount = this.allBookings?.length
        this.BookingsAmount = this.allBookings?.reduce((sum, item) => sum + (item.totalAmount || 0), 0)

        this.OutcomersCount = this.allBookings?.reduce(
          (sum, item) =>
            sum + ((item?.defaultVisitorCount ?? 0) + (item?.VisitorCount ?? 0)),
          0
        );

        this.defualtOutcomersCount = this.allBookings?.reduce(
          (sum, item) =>
            sum + (item?.defaultVisitorCount ?? 0),
          0
        );

        this.newOutcomersCount = this.allBookings?.reduce(
          (sum, item) =>
            sum + (item?.VisitorCount ?? 0),
          0
        );

        this.BookingsOutcomersAmount = Math.round(
          this.allBookings?.reduce(
            (total, booking) =>
              total +
              (booking.newOutcomers || []).reduce(
                (sum:any, outcomer:any) => sum + Number(outcomer.price || 0),
                0
              ),
            0
          )
        );

        this.topCustomers = this.allBookings.map((booking: any) => {
            const outcomersAmount = (booking.newOutcomers || []).reduce(
              (sum: number, outcomer: any) => sum + Number(outcomer.price || 0),
              0
            );

            const totalPaid =
              Number(booking.payOneAmount || 0) +
              Number(booking.payTwoAmount || 0) +
              outcomersAmount;

            return {
              id: booking.id,
              name:  booking.userName || booking.userNameAr,
              email: booking.userEmail,
              phone: booking.userPhone,
              avatar: booking.userImage,
              amount: totalPaid,
              bookingAmount:
                Number(booking.payOneAmount || 0) +
                Number(booking.payTwoAmount || 0),
              outcomersAmount,
              visitors: booking.totalVisitors,
              eventName: booking.EventName
            };

          }).sort((a: any, b: any) => b.amount - a.amount).slice(0, 50);

        this.topEvents = this.allEvents.map((event: any) => {

          const eventBookings = this.allBookings.filter(
            (booking: any) => booking.EventId === event.id
          );

          const totalIncome = eventBookings.reduce((total: number, booking: any) => {

            const outcomers = (booking.newOutcomers || []).reduce(
              (sum: number, item: any) => sum + Number(item.price || 0),
              0
            );

            return (
              total +
              Number(booking.payOneAmount || 0) +
              Number(booking.payTwoAmount || 0) +
              outcomers
            );

          }, 0);

          return {
            eventImage: event.Image,
            eventName: event.EventName,
            organizerName: event.OriganizerName,
            amount: totalIncome
          };

        }).sort((a, b) => b.amount - a.amount).slice(0, 50);

        console.log(this.topEvents);


        this.topEventsChart = {
          ...this.topEventsChart,

          series: [
            {
              name: 'Revenue',
              data: this.topEvents.map(x => x.amount)
            }
          ],

          xaxis: {
            categories: this.topEvents.map(x => x.eventName)
          }
        };

        this.totalAmount = this.BookingsAmount + this.BookingsOutcomersAmount
        this.updateSalesChart();
      }
    })
  }

  // Start Charts
  selectedFilter: 'day' | 'week' | 'month' | 'year' = 'month';
  totalIncome = 0;
  totalExpenses = 0;
  totalBalance = 0;
  filteredIncome = 0;
  filteredExpenses = 0;
  filteredBalance = 0;

  private getPaymentTransactions() {

    const transactions: { date: Date; amount: number }[] = [];

    this.allBookings.forEach((booking: any) => {

      // الدفعة الأولى
      if (booking.payOneAmount && booking.createdAtOne) {
        transactions.push({
          date: booking.createdAtOne.toDate(),
          amount: Number(booking.payOneAmount)
        });
      }

      // الدفعة الثانية
      if (booking.payTwoAmount && booking.createdAtTwo) {
        transactions.push({
          date: booking.createdAtTwo.toDate(),
          amount: Number(booking.payTwoAmount)
        });
      }

      // دفعات المرافقين
      (booking.newOutcomers || []).forEach((outcomer: any) => {

        if (outcomer.price && outcomer.createdAt) {
          transactions.push({
            date: outcomer.createdAt.toDate(),
            amount: Number(outcomer.price)
          });
        }

      });

    });

    return transactions;

  }

  salesAnalyticChart: Partial<ChartOptions> = {
    chart: {
      height: 341,
      type: 'area',

      dropShadow: {
        enabled: true,
        opacity: 0.2,
        blur: 10,
        left: -7,
        top: 22,
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ['#604ae3', '#f00'],
    dataLabels: {
      enabled: false,
    },

    stroke: {
      show: true,
      curve: 'smooth',
      width: 2,
      lineCap: 'square',
    },
    series: [
      {
        name: 'Expenses',
        data: []
      },
      {
        name: 'Income',
        data: []
      },
    ],
    labels: [],
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        show: true,
      },
      labels: {
        offsetX: 0,
        offsetY: 5,
        style: {
          fontSize: '12px',
          cssClass: 'apexcharts-xaxis-title',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => {

          if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
          }

          return value.toString();

        },
        offsetX: -15,
        offsetY: 0,
        style: {
          fontSize: '12px',
          cssClass: 'apexcharts-yaxis-title',
        },
      },
    },
    grid: {
      borderColor: '#191e3a',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: -50,
        right: 0,
        bottom: 0,
        left: 5,
      },
    },
    legend: {
      show: false,
    },

    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        shadeIntensity: 1,
        inverseColors: !1,
        opacityFrom: 0.12,
        opacityTo: 0.1,
        stops: [100, 100],
      },
    },
    responsive: [
      {
        breakpoint: 575,
        options: {
          legend: {
            offsetY: -50,
          },
        },
      },
    ],
  }

  changeFilter(filter: 'day' | 'week' | 'month' | 'year') {
    this.selectedFilter = filter;
    this.updateSalesChart();
  }

  get filterLabel(): string {

    switch(this.selectedFilter){

      case 'day':
        return 'Today';

      case 'week':
        return 'This Week';

      case 'month':
        return 'This Month';

      case 'year':
        return 'This Year';

      default:
        return '';

    }

  }

  updateSalesChart() {

    const transactions = this.getPaymentTransactions();

    const now = new Date();

    let labels: string[] = [];
    let income: number[] = [];
    let expenses: number[] = [];

    if (this.selectedFilter === 'year') {

      labels = [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
      ];

      income = Array(12).fill(0);
      expenses = Array(12).fill(0);

      transactions.forEach(item => {

        if (item.date.getFullYear() === now.getFullYear()) {

          income[item.date.getMonth()] += item.amount;

        }

      });

    }

    else if (this.selectedFilter === 'month') {

      const days = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();

      labels = Array.from(
        { length: days },
        (_, i) => (i + 1).toString()
      );

      income = Array(days).fill(0);
      expenses = Array(days).fill(0);

      transactions.forEach(item => {

        if (
          item.date.getMonth() === now.getMonth() &&
          item.date.getFullYear() === now.getFullYear()
        ) {

          income[item.date.getDate() - 1] += item.amount;

        }

      });

    }

    else if (this.selectedFilter === 'day') {
      labels = [
        '00:00',
        '02:00',
        '04:00',
        '06:00',
        '08:00',
        '10:00',
        '12:00',
        '14:00',
        '16:00',
        '18:00',
        '20:00',
        '22:00'
      ];

      income = Array(12).fill(0);
      expenses = Array(12).fill(0);


      transactions.forEach(item => {

        if (
          item.date.getDate() === now.getDate() &&
          item.date.getMonth() === now.getMonth() &&
          item.date.getFullYear() === now.getFullYear()
        ) {

          const hourIndex = Math.floor(item.date.getHours() / 2);

          income[hourIndex] += item.amount;

        }

      });

    }

    else {

      labels = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
      ];

      income = Array(7).fill(0);
      expenses = Array(7).fill(0);

      const start = new Date();

      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);

      transactions.forEach(item => {

        if (item.date >= start) {

          income[item.date.getDay()] += item.amount;

        }

      });

    }

    this.totalIncome = income.reduce((a, b) => a + b, 0);
    this.filteredIncome = this.totalIncome;

    // مؤقتًا لحد ما تعمل expenses collection
    this.filteredExpenses = 0;
    this.filteredBalance =
    this.filteredIncome - this.filteredExpenses;

    this.salesAnalyticChart = {
      ...this.salesAnalyticChart,

      labels,

      series: [
        {
          name: 'Income',
          data: income
        },
        {
          name: 'Expenses',
          data: expenses
        }
      ]
    };

  }


  // Top Event
  topEventsChart: Partial<ChartOptions> = {
    chart: {
      height: 480,
      parentHeightOffset: 0,
      type: 'bar',
      toolbar: {
        show: !1,
      },
    },

    plotOptions: {
      bar: {
        barHeight: '100%',
        columnWidth: '30%',
        borderRadius: 4,
        distributed: !0,
      }
    },

    grid: {
      show: true,
      padding: {
        top: -20,
        bottom: -10,
        left: 0,
        right: 0,
      },
    },

    dataLabels: {
      enabled: !1,
    },

    colors: ['#604ae3'],

    series: [
      {
        name: 'Revenue',
        data: []
      }
    ],

    legend: {
      show: !1,
    },

    xaxis: {
      categories: [],
      axisBorder: {
        show: !1,
      },
      axisTicks: {
        show: !1,
      },
    },

    yaxis: {
      labels: {
        show: !1,
      },
    },

    tooltip: {
      y: [
        {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y + ' EGP'
            }
            return y
          },
        },
      ],
    },
    responsive: [
      {
        breakpoint: 1025,
        options: {
          chart: {
            height: 199,
          },
        },
      },
    ],
  };
}
