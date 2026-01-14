import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import {
  NgbDropdownModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap'
import { revenueData } from '../../data'
import { currency } from '@common/constants'

@Component({
    selector: 'agent-revenue',
    imports: [NgbDropdownModule, NgbProgressbarModule],
    templateUrl: './revenue.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RevenueComponent {
  revenueList = revenueData
  currency = currency
}
