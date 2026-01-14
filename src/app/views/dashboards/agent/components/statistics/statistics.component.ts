import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { statData } from '../../data'

@Component({
    selector: 'agent-statistics',
    imports: [],
    templateUrl: './statistics.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StatisticsComponent {
  statData = statData
}
