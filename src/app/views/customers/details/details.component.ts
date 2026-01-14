import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { CustomerInfoComponent } from './components/customer-info/customer-info.component'
import { PropertyCardComponent } from './components/property-card/property-card.component'
import { InterestedPropertyComponent } from './components/interested-property/interested-property.component'
import { WeeklyInquiryComponent } from './components/weekly-inquiry/weekly-inquiry.component'
import { TransactionsComponent } from './components/transactions/transactions.component'
import { OwnPropertyComponent } from './components/own-property/own-property.component'
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component'

@Component({
    selector: 'app-details',
    imports: [
        PageTitleComponent,
        CustomerInfoComponent,
        PropertyCardComponent,
        InterestedPropertyComponent,
        WeeklyInquiryComponent,
        TransactionsComponent,
        OwnPropertyComponent,
        TransactionHistoryComponent,
    ],
    templateUrl: './details.component.html',
    styles: ``
})
export class DetailsComponent {}
