import type { ChartOptions } from '@common/apexchart.model'
import { currency } from '@common/constants'

const flagBrImg = 'assets/images/flag/br.svg'
const flagCaImg = 'assets/images/flag/ca.svg'
const flagRuImg = 'assets/images/flag/ru.svg'
const flagUsImg = 'assets/images/flag/us.svg'

export type CustomersCountryType = {
  country: string
  amount: string
  change: string
  progress: number
  image: string
  totalCustomers: number
}

export const customersCountryData: CustomersCountryType[] = [
  {
    country: 'Brazil',
    amount: '15,781',
    change: '10.0',
    progress: 30,
    image: flagBrImg,
    totalCustomers: 3474,
  },
  {
    country: 'Canada',
    amount: '23,263',
    change: '4.1',
    progress: 70,
    image: flagCaImg,
    totalCustomers: 7843,
  },
  {
    country: 'Russia',
    amount: '30,562',
    change: '7.1',
    progress: 50,
    image: flagRuImg,
    totalCustomers: 5933,
  },
  {
    country: 'USA',
    amount: '41,341',
    change: '12.0',
    progress: 80,
    image: flagUsImg,
    totalCustomers: 8901,
  },
]

export const propertyOptions: Partial<ChartOptions> = {
  chart: {
    height: 182,
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
    },
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
  colors: ['#efecfc', '#604ae3', '#604ae3', '#efecfc'],
  dataLabels: {
    enabled: !1,
  },
  series: [
    {
      name: 'Invest',
      data: [40, 50, 65, 45, 40, 70, 40, 50, 45, 20, 10, 29],
    },
  ],
  legend: {
    show: !1,
  },
  xaxis: {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
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
            return '$' + y.toFixed(2) + 'k'
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
}

export const customersInvestOptions: Partial<ChartOptions> = {
  chart: {
    height: 300,
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: '30%',
      dataLabels: {
        position: 'top',
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val + '%'
    },
    offsetY: -25,
    style: {
      fontSize: '12px',
      colors: ['#304758'],
    },
  },
  colors: ['#604ae3'],
  legend: {
    show: true,
    horizontalAlign: 'center',
    offsetX: 0,
    offsetY: -5,
  },
  series: [
    {
      name: 'Invest Percentage',
      data: [12.3, 3.1, 4.0, 10.1, 6.0, 2.3, 19.4],
    },
  ],
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July'],
    position: 'bottom',
    labels: {
      offsetY: 0,
    },
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    },

    tooltip: {
      enabled: true,
      offsetY: -10,
    },
  },

  yaxis: {
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    },
    labels: {
      show: true,
      formatter: function (val) {
        return val + '%'
      },
    },
  },
  grid: {
    row: {
      colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.2,
    },
    borderColor: '#f1f3fa',
  },
}

export const customerVisit: Partial<ChartOptions> = {
  chart: {
    type: 'area',
    height: 150,
    sparkline: {
      enabled: true,
    },
  },
  series: [
    {
      data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54],
    },
  ],
  stroke: {
    width: 2,
    curve: 'smooth',
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'vertical',
      opacityFrom: 0.4,
      opacityTo: 0,
      stops: [0, 100],
    },
  },

  markers: {
    size: 0,
  },
  colors: ['#604ae3'],
  tooltip: {
    fixed: {
      enabled: false,
    },
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: function () {
          return ''
        },
      },
    },
    marker: {
      show: false,
    },
  },
}

export type CustomerType = {
  name: string
  email: string
  avatar: string
  amount: string
}

export const TopCustomers: CustomerType[] = [
  {
    name: 'Tiia Karppinen',
    email: 'tiiakarppinen@teleworm.us',
    avatar: 'assets/images/users/avatar-6.jpg',
    amount: currency + '733,291',
  },
  {
    name: 'Harland R. Orsini',
    email: 'harlandrorsini@dayrep.com',
    avatar: 'assets/images/users/avatar-7.jpg',
    amount: currency + '831,760',
  },
  {
    name: 'David Padgett',
    email: 'davidpadgett@armyspy.com',
    avatar: 'assets/images/users/avatar-8.jpg',
    amount: currency + '647,900',
  },
  {
    name: 'Yusra Hasibah',
    email: 'yusraHasibahadad@rhyta.com',
    avatar: 'assets/images/users/avatar-10.jpg',
    amount: currency + '530,389',
  },
  {
    name: 'Valerie Obrien',
    email: 'valerieobrien@dayrep.com',
    avatar: 'assets/images/users/avatar-9.jpg',
    amount: currency + '763,829',
  },
]
