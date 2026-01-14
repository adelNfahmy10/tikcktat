import { currentYear } from '@common/constants'

type UserType = {
  name: string
  image: string
}

type PaymentType = {
  card: string
  name: string
}

export type TransactionType = {
  id: string
  user: UserType
  purchaseDate: string
  amount: string
  paymentMethod: PaymentType
  agentName: string
  investedProperty: string
  paymentType: string
  paymentStatus: string
}
export const transactionData: TransactionType[] = [
  {
    id: 'TXN-341220',
    user: {
      name: 'Ray C. Nichols',
      image: 'assets/images/users/avatar-2.jpg',
    },
    purchaseDate: '05/01/' + currentYear,
    amount: '13,987',
    paymentMethod: {
      card: 'assets/images/card/mastercard.svg',
      name: 'Mastercard **** 3467',
    },
    agentName: 'Michael A. Miner',
    investedProperty: 'W. straat 102 DK Deventer',
    paymentType: 'Mastercard',
    paymentStatus: 'Completed',
  },
  {
    id: 'TXN-547891',
    user: {
      name: 'Barbara A. Woods',
      image: 'assets/images/users/avatar-3.jpg',
    },
    purchaseDate: '14/02/' + currentYear,
    amount: '11,345',
    paymentMethod: {
      card: 'assets/images/card/visa.svg',
      name: 'Visa card **** 4722',
    },
    agentName: 'Theresa T. Brose',
    investedProperty: 'Isaac Tirionplein 100',
    paymentType: 'Visa',
    paymentStatus: 'Completed',
  },
  {
    id: 'TXN-230477',
    user: {
      name: 'Robert Mendoza',
      image: 'assets/images/users/avatar-4.jpg',
    },
    purchaseDate: '23/03/' + currentYear,
    amount: '16,789',
    paymentMethod: {
      card: 'assets/images/card/mastercard.svg',
      name: 'Mastercard **** 7263',
    },
    agentName: 'Walter L. Calab',
    investedProperty: '123 Maple St, 456 Oak Ave',
    paymentType: 'Mastercard',
    paymentStatus: 'Canceled',
  },
  {
    id: 'TXN-189348',
    user: {
      name: 'Rita Correa',
      image: 'assets/images/users/avatar-5.jpg',
    },
    purchaseDate: '11/04/' + currentYear,
    amount: '14,567',
    paymentType: 'Paypal',
    paymentStatus: 'Pending',
    agentName: 'Olive Mize',
    investedProperty: '3822 DT Amersfoort',
    paymentMethod: {
      card: 'assets/images/card/paypal.svg',
      name: 'gailsoneil31@rhyta.com',
    },
  },
  {
    id: 'TXN-765434',
    user: {
      name: 'Beatriz McClure',
      image: 'assets/images/users/avatar-6.jpg',
    },
    purchaseDate: '30/05/' + currentYear,
    amount: '10,234',
    paymentType: 'Visa',
    paymentStatus: 'Completed',
    agentName: 'Christa Sardina',
    investedProperty: '3822 DT Amersfoort',
    paymentMethod: {
      card: 'assets/images/card/visa.svg',
      name: 'Visa card **** 8263',
    },
  },
  {
    id: 'TXN-452103',
    user: {
      name: 'Luis P. Brick',
      image: 'assets/images/users/avatar-7.jpg',
    },
    purchaseDate: '19/06/' + currentYear,
    amount: '17,890',
    paymentType: 'Paypal',
    paymentStatus: 'Pending',
    agentName: 'Darren Rivera',
    investedProperty: '3181 BE Rozenburg',
    paymentMethod: {
      card: 'assets/images/card/paypal.svg',
      name: 'hughcrobinson@rhyta.com',
    },
  },
  {
    id: 'TXN-986712',
    user: {
      name: 'Gary Jimenez',
      image: 'assets/images/users/avatar-8.jpg',
    },
    purchaseDate: '28/07/' + currentYear,
    amount: '12,453',
    paymentType: 'Mastercard',
    paymentStatus: 'Completed',
    agentName: 'Robert V. Leavitt',
    investedProperty: 'Julianastraat ZX 7031',
    paymentMethod: {
      card: 'assets/images/card/mastercard.svg',
      name: 'Mastercard **** 9200',
    },
  },
  {
    id: 'TXN-324569',
    user: {
      name: 'Beatrice Ruiz',
      image: 'assets/images/users/avatar-9.jpg',
    },
    purchaseDate: '07/08/' + currentYear,
    amount: '15,678',
    paymentType: 'Visa',
    paymentStatus: 'Canceled',
    agentName: 'Lydia Anderson',
    investedProperty: '2561 DB Den Haag',
    paymentMethod: {
      card: 'assets/images/card/visa.svg',
      name: 'Visa card **** 8940',
    },
  },
]
