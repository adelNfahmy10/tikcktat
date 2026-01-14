import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { goalsOptions } from '../../data'
import { NgApexchartsModule } from 'ng-apexcharts'
import { currency } from '@common/constants'

@Component({
    selector: 'agent-goals',
    imports: [NgApexchartsModule],
    templateUrl: './goals.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GoalsComponent {
  goalChart = goalsOptions
  currency = currency
}
