import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap'
import { transactionData } from '@views/customers/data'

@Component({
    selector: 'customer-transaction-history',
    imports: [NgbPaginationModule, NgbDropdownModule],
    templateUrl: './transaction-history.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransactionHistoryComponent {
  transactionList = transactionData
}
