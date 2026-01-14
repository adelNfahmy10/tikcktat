import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { currency, currentYear } from '@common/constants'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
    selector: 'property-info',
    imports: [NgbDropdownModule],
    templateUrl: './property-info.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PropertyInfoComponent {
  currency = currency
  currentYear = currentYear
}
