import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { transactionData } from '../../data'
import { CommonModule } from '@angular/common'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { currency } from '@common/constants'

@Component({
    selector: 'analytics-transaction',
    imports: [CommonModule, NgbDropdownModule],
    templateUrl: './transaction.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransactionComponent {
  transactionList = transactionData
  currency = currency
}
