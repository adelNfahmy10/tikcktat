import { Component } from '@angular/core'
import { NgApexchartsModule } from 'ng-apexcharts'
import { socialOptions } from '../../data'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
    selector: 'analytics-social-source',
    imports: [NgApexchartsModule, NgbDropdownModule],
    templateUrl: './social-source.component.html',
    styles: ``
})
export class SocialSourceComponent {
  propertyChart = socialOptions
}
