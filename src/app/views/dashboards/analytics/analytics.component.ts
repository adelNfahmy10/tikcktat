import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { StatisticsComponent } from './components/statistics/statistics.component'
import { SalesChartComponent } from './components/sales-chart/sales-chart.component'
import { BalanceCardComponent } from './components/balance-card/balance-card.component'
import { SocialSourceComponent } from './components/social-source/social-source.component'
import { SalesLocationComponent } from './components/sales-location/sales-location.component'
import { WeeklySalesComponent } from './components/weekly-sales/weekly-sales.component'
import { TransactionComponent } from './components/transaction/transaction.component'

@Component({
    selector: 'app-analytics',
    imports: [
        PageTitleComponent,
        StatisticsComponent,
        SalesChartComponent,
        BalanceCardComponent,
        SocialSourceComponent,
        SalesLocationComponent,
        WeeklySalesComponent,
        TransactionComponent,
    ],
    templateUrl: './analytics.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AnalyticsComponent {}
