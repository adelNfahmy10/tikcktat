import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'
import { currency } from '@common/constants'

@Component({
    selector: 'app-transaction-modal',
    imports: [],
    templateUrl: './transaction-modal.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransactionModalComponent {
  @Input() data: any
  currency = currency
}
