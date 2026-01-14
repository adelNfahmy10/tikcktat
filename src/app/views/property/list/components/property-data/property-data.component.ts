import { CommonModule, DecimalPipe } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { currency } from '@common/constants'
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap'
import { propertyData } from '@views/property/data'

@Component({
    selector: 'property-data',
    imports: [DecimalPipe, CommonModule, NgbPaginationModule, NgbDropdownModule],
    templateUrl: './property-data.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PropertyDataComponent {
  propertyList = propertyData
  currency = currency
}
