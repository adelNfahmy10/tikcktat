import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { transactionData } from './data'
import {
  NgbDropdownModule,
  NgbModal,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap'
import { TransactionModalComponent } from './components/transaction-modal/transaction-modal.component'
import { CommonModule } from '@angular/common'
import { currency } from '@common/constants'

@Component({
    selector: 'app-transactions',
    imports: [
        PageTitleComponent,
        NgbPaginationModule,
        NgbDropdownModule,
        CommonModule,
    ],
    templateUrl: './transactions.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransactionsComponent {
  currency = currency
  transactions = transactionData

  modalService = inject(NgbModal)

  openModal() {
    this.modalService.open(TransactionModalComponent, { centered: true })
  }
}
