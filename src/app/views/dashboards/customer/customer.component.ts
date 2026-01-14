import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { StateComponent } from './components/state/state.component'
import { PropertyInvestorComponent } from './components/property-investor/property-investor.component'
import { CustomerInvestComponent } from './components/customer-invest/customer-invest.component'
import { CustomerByCountryComponent } from './components/customer-by-country/customer-by-country.component'
import { RecentPurchaseComponent } from './components/recent-purchase/recent-purchase.component'
import { TopCustomerComponent } from './components/top-customer/top-customer.component'
import { CustomerVisitComponent } from './components/customer-visit/customer-visit.component'

@Component({
    selector: 'app-customer',
    imports: [
        PageTitleComponent,
        StateComponent,
        PropertyInvestorComponent,
        CustomerInvestComponent,
        CustomerByCountryComponent,
        RecentPurchaseComponent,
        TopCustomerComponent,
        CustomerVisitComponent,
    ],
    templateUrl: './customer.component.html',
    styles: ``
})
export class CustomerComponent {}
