import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'
import { propertyCards } from '@views/customers/data'

@Component({
    selector: 'customer-property-card',
    imports: [NgbProgressbarModule],
    templateUrl: './property-card.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PropertyCardComponent {
  property = propertyCards
}
