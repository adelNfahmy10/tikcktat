import { Component } from '@angular/core'
import { agentOptions } from '../../data'
import { NgApexchartsModule } from 'ng-apexcharts'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { currency } from '@common/constants'

@Component({
    selector: 'recent-agent',
    imports: [NgApexchartsModule, NgbDropdownModule],
    templateUrl: './recent-agent.component.html',
    styles: ``
})
export class RecentAgentComponent {
  agentChart = agentOptions

  currency = currency
}
