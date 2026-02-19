import type { Route } from '@angular/router'
import { InboxComponent } from './apps/inbox/inbox.component'
import { MessagesComponent } from './apps/messages/messages.component'
import { OrdersComponent } from './apps/orders/orders.component'
import { ReviewsComponent } from './apps/reviews/reviews.component'
import { TransactionsComponent } from './apps/transactions/transactions.component'
import { WidgetsComponent } from './apps/widgets/widgets.component'
import { HomeComponent } from './tikcket@/home/home.component'
import { CheckoutComponent } from './tikcket@/checkout/checkout.component'
import { AddEventComponent } from './tikcket@/admin-system/add-event/add-event.component'
import { SigninComponent } from './tikcket@/authorization/signin/signin.component';
import { SignupComponent } from './tikcket@/authorization/signup/signup.component'
import { QrcodeComponent } from './tikcket@/qrcode/qrcode.component'
import { ForgetpasswrodComponent } from './tikcket@/authorization/forgetpasswrod/forgetpasswrod.component'
import { ResetuserpasswordComponent } from './tikcket@/authorization/resetuserpassword/resetuserpassword.component'
import { AdminViewEventComponent } from './tikcket@/admin-system/admin-view-event/admin-view-event.component'
import { OwnersComponent } from './tikcket@/admin-system/owners/owners.component'
import { AvailableEventsComponent } from './tikcket@/available-events/available-events.component'
import { OrganizerEventsComponent } from './tikcket@/organizer-system/organizer-events/organizer-events.component'
import { OrganizerEventDetailsComponent } from './tikcket@/organizer-system/organizer-event-details/organizer-event-details.component'
import { OrganizerEventAttendeesComponent } from './tikcket@/organizer-system/organizer-event-attendees/organizer-event-attendees.component'
import { AvailableEventsDetailsComponent } from './tikcket@/available-events-details/available-events-details.component'

export const VIEWS_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch:'full'
  },
  // Booking Cycle
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' },
  },
  {
    path: 'available-event/:type',
    component: AvailableEventsComponent,
    data: { title: 'Events' },
  },
  {
    path: 'available-event-details/:id',
    component: AvailableEventsDetailsComponent,
    data: { title: 'Event Details' },
  },
  {
    path: 'checkout/:id',
    component: CheckoutComponent,
    data: { title: 'Checkout' },
  },
    {
    path: 'qrcode/:ip',
    component: QrcodeComponent,
    data: { title: 'QRCode' },
  },


  // Admin Components
  {
    path: 'all-events',
    component: AdminViewEventComponent,
    data: { title: 'All Events' },
  },
  {
    path: 'add-event',
    component: AddEventComponent,
    data: { title: 'Add Eevent' },
  },
  {
    path: 'register',
    component: SignupComponent,
    data: { title: 'SignUp' },
  },
  {
    path: 'owners',
    component: OwnersComponent,
    data: { title: 'All Owners' },
  },

  // Organizer Components
  {
    path: 'organizer-events',
    component: OrganizerEventsComponent,
    data: { title: 'My Events' },
  },
  {
    path: 'organizer-event-details/:id',
    component: OrganizerEventDetailsComponent,
    data: { title: 'My Events' },
  },
  {
    path: 'event-attendees/:type/:eventId',
    component: OrganizerEventAttendeesComponent,
    data: { title: 'Grad Details' },
  },

  // Auth Components
  {
    path: 'login',
    component: SigninComponent,
    data: { title: 'SignIn' },
  },
  {
    path: 'reset-password',
    component: ResetuserpasswordComponent,
    data: { title: 'Reset Password' },
  },
   {
    path: 'forget-password',
    component: ForgetpasswrodComponent,
    data: { title: 'Forget Password' },
  },







  {
    path: 'dashboards',
    loadChildren: () =>
      import('./dashboards/dashboard.route').then(
        (mod) => mod.DASHBOARD_ROUTES
      ),
  },
  {
    path: 'property',
    loadChildren: () =>
      import('./property/property.route').then((mod) => mod.PROPERTY_ROUTES),
  },
  {
    path: 'agents',
    loadChildren: () =>
      import('./agents/agents.route').then((mod) => mod.AGENT_ROUTES),
  },
  {
    path: 'customers',
    loadChildren: () =>
      import('./customers/customers.route').then((mod) => mod.CUSTOMER_ROUTES),
  },
  {
    path: 'orders',
    component: OrdersComponent,
    data: { title: 'Orders' },
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    data: { title: 'Transactions' },
  },
  {
    path: 'reviews',
    component: ReviewsComponent,
    data: { title: 'Reviews' },
  },
  {
    path: 'messages',
    component: MessagesComponent,
    data: { title: 'Messages' },
  },
  {
    path: 'inbox',
    component: InboxComponent,
    data: { title: 'Inbox' },
  },
  {
    path: 'post',
    loadChildren: () =>
      import('./post/post.route').then((mod) => mod.POST_ROUTES),
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages.route').then((mod) => mod.PAGES_ROUTES),
  },
  {
    path: 'widgets',
    component: WidgetsComponent,
    data: { title: 'Widgets' },
  },
  {
    path: 'ui',
    loadChildren: () => import('./ui/ui.route').then((mod) => mod.UI_ROUTES),
  },
  {
    path: 'extended',
    loadChildren: () =>
      import('./extended/extended.route').then((mod) => mod.EXTENDED_ROUTES),
  },
  {
    path: 'charts',
    loadChildren: () =>
      import('./charts/charts.route').then((mod) => mod.CHART_ROUTES),
  },
  {
    path: 'forms',
    loadChildren: () =>
      import('./forms/forms.route').then((mod) => mod.FORMS_ROUTES),
  },
  {
    path: 'tables',
    loadChildren: () =>
      import('./tables/table.route').then((mod) => mod.TABLE_ROUTES),
  },
  {
    path: 'icons',
    loadChildren: () =>
      import('./icons/icons.route').then((mod) => mod.ICONS_ROUTES),
  },
  {
    path: 'maps',
    loadChildren: () =>
      import('./maps/maps.route').then((mod) => mod.MAPS_ROUTES),
  },
]
