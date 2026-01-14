import type { Route } from '@angular/router'
import { ListComponent } from './list/list.component'
import { GridComponent } from './grid/grid.component'
import { DetailsComponent } from './details/details.component'
import { AddComponent } from './add/add.component'

export const PROPERTY_ROUTES: Route[] = [
  { path: 'list', component: ListComponent, data: { title: 'Listing Grid' } },
  { path: 'grid', component: GridComponent, data: { title: 'Listing List' } },
  {
    path: 'details',
    component: DetailsComponent,
    data: { title: 'Property Overview' },
  },
  { path: 'add', component: AddComponent, data: { title: 'Add Property' } },
]
