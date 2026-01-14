import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { currency } from '@common/constants'

@Component({
    selector: 'customer-transactions',
    imports: [],
    templateUrl: './transactions.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransactionsComponent {
  currency = currency
}
