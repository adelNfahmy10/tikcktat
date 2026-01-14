import { Component } from '@angular/core'
import { NgApexchartsModule } from 'ng-apexcharts'
import { salesFunnelOptions } from '../../data'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
    selector: 'agent-sales-funnel',
    imports: [NgApexchartsModule, NgbDropdownModule],
    templateUrl: './sales-funnel.component.html',
    styles: ``
})
export class SalesFunnelComponent {
  funnelChart = salesFunnelOptions
}
