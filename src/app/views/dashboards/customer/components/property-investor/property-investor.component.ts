import { Component } from '@angular/core'
import { propertyOptions } from '../../data'
import { NgApexchartsModule } from 'ng-apexcharts'
import { RouterLink } from '@angular/router'

@Component({
    selector: 'customer-property-investor',
    imports: [NgApexchartsModule, RouterLink],
    templateUrl: './property-investor.component.html',
    styles: ``
})
export class PropertyInvestorComponent {
  investChart = propertyOptions
}
