import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { NgApexchartsModule } from 'ng-apexcharts'
import { customerVisit } from '../../data'
import {
  NgbDropdownModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap'

@Component({
    selector: 'customer-visit',
    imports: [NgApexchartsModule, NgbDropdownModule, NgbProgressbarModule],
    templateUrl: './customer-visit.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomerVisitComponent {
  visitChart = customerVisit
}
