import type { Route } from '@angular/router'
import { ListComponent } from './list/list.component'
import { GridComponent } from './grid/grid.component'
import { DetailsComponent } from './details/details.component'
import { AddComponent } from './add/add.component'

export const CUSTOMER_ROUTES: Route[] = [
  { path: 'list', component: ListComponent, data: { title: 'Customer List' } },
  { path: 'grid', component: GridComponent, data: { title: 'Customer Grid' } },
  {
    path: 'details',
    component: DetailsComponent,
    data: { title: 'Customer Overview' },
  },
  { path: 'add', component: AddComponent, data: { title: 'Customers Add' } },
]
