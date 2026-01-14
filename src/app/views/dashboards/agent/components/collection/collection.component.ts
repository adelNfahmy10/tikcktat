import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { currency } from '@common/constants'
import {
  NgbDropdownModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap'

@Component({
    selector: 'agent-collection',
    imports: [NgbDropdownModule, NgbProgressbarModule],
    templateUrl: './collection.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CollectionComponent {
  currency = currency
}
