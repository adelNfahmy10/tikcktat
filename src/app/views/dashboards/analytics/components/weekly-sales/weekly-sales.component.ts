import { Component } from '@angular/core'
import { salesOptions } from '../../data'
import { NgApexchartsModule } from 'ng-apexcharts'
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
    selector: 'analytics-weekly-sales',
    imports: [NgApexchartsModule, NgbCarouselModule],
    templateUrl: './weekly-sales.component.html',
    styles: ``
})
export class WeeklySalesComponent {
  weeklyChart = salesOptions
}
