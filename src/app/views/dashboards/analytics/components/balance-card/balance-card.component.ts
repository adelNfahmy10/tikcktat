import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { propertyData } from '../../data'
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'
import { currency } from '@common/constants'

@Component({
    selector: 'analytics-balance-card',
    imports: [NgbProgressbarModule],
    templateUrl: './balance-card.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BalanceCardComponent {
  propertyList = propertyData
  currency = currency
}
