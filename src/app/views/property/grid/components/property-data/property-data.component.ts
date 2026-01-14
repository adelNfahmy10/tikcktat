import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { propertyData } from '../../../data'
import { CommonModule, DecimalPipe } from '@angular/common'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { currency } from '@common/constants'

@Component({
    selector: 'property-data',
    imports: [DecimalPipe, CommonModule, NgbPaginationModule],
    templateUrl: './property-data.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PropertyDataComponent {
  propertyList = propertyData
  currency = currency
}
