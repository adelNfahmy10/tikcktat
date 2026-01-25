import type { Route } from '@angular/router'
import { InboxComponent } from './apps/inbox/inbox.component'
import { MessagesComponent } from './apps/messages/messages.component'
import { OrdersComponent } from './apps/orders/orders.component'
import { ReviewsComponent } from './apps/reviews/reviews.component'
import { TransactionsComponent } from './apps/transactions/transactions.component'
import { WidgetsComponent } from './apps/widgets/widgets.component'
import { HomeComponent } from './tikcket@/home/home.component'
import { EventComponent } from './tikcket@/event/event.component'
import { EventDetailsComponent } from './tikcket@/event-details/event-details.component'
import { CheckoutComponent } from './tikcket@/checkout/checkout.component'
import { AddEventComponent } from './tikcket@/add-event/add-event.component'
import { SigninComponent } from './tikcket@/authorization/signin/signin.component';
import { SignupComponent } from './tikcket@/authorization/signup/signup.component'
import { ViewEventsComponent } from './tikcket@/view-events/view-events.component'
import { ViewEventDetailsComponent } from './tikcket@/view-event-details/view-event-details.component'
import { AdminViewEventComponent } from './tikcket@/admin-view-event/admin-view-event.component'

export const VIEWS_ROUTES: Route[] = [
   {
    path: '',
    redirectTo: 'home',
    pathMatch:'full'
  },
  {
    path: 'home',
    component: HomeComponent,
     data: { title: 'Home' },
  },
  {
    path: 'event/:type',
    component: EventComponent,
     data: { title: 'Events' },
  },
  {
    path: 'event-details/:id',
    component: EventDetailsComponent,
     data: { title: 'Event Details' },
  },
  {
    path: 'checkout/:id',
    component: CheckoutComponent,
     data: { title: 'Checkout' },
  },
  {
    path: 'add-event',
    component: AddEventComponent,
     data: { title: 'Add Eevent' },
  },
  {
    path: 'all-events',
    component: AdminViewEventComponent,
     data: { title: 'All Events' },
  },
  {
    path: 'user-events',
    component: ViewEventsComponent,
     data: { title: 'My Events' },
  },
  {
    path: 'user-event-details/:eventId',
    component: ViewEventDetailsComponent,
     data: { title: 'My Events' },
  },


  {
    path: 'login',
    component: SigninComponent,
     data: { title: 'SignIn' },
  },
  {
    path: 'register',
    component: SignupComponent,
     data: { title: 'SignUp' },
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
