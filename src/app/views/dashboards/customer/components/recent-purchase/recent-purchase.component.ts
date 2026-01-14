import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { currency } from '@common/constants'

@Component({
    selector: 'customer-recent-purchase',
    imports: [],
    templateUrl: './recent-purchase.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RecentPurchaseComponent {
  currency = currency
}
