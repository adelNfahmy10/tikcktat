import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { customerData } from '../data'
import { CommonModule } from '@angular/common'
import { currency } from '@common/constants'
import { RouterLink } from '@angular/router'

@Component({
    selector: 'app-grid',
    imports: [PageTitleComponent, CommonModule, RouterLink],
    templateUrl: './grid.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GridComponent {
  customers = customerData
  currency = currency
}
