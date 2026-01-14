import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import type { ChartOptions } from '@common/apexchart.model'
import { NgApexchartsModule } from 'ng-apexcharts'
import { chartOptions, statisticData } from '../../data'
import { CommonModule, DecimalPipe } from '@angular/common'

@Component({
    selector: 'analytics-statistics',
    imports: [NgApexchartsModule, CommonModule, DecimalPipe],
    templateUrl: './statistics.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StatisticsComponent {
  statisticData = statisticData

  totalCustomersChart = chartOptions
}
