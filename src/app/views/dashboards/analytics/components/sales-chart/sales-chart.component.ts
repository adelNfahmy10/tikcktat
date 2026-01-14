import { Component } from '@angular/core'
import type { ChartOptions } from '@common/apexchart.model'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { NgApexchartsModule } from 'ng-apexcharts'
import { salesChart } from '../../data'
import { currency } from '@common/constants'

@Component({
    selector: 'analytics-sales-chart',
    imports: [NgApexchartsModule, NgbDropdownModule],
    templateUrl: './sales-chart.component.html',
    styles: ``
})
export class SalesChartComponent {
  salesAnalyticChart: Partial<ChartOptions> = salesChart
  currency = currency
}
