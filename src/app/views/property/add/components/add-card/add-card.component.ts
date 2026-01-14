import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { currency } from '@common/constants'

@Component({
    selector: 'add-card',
    imports: [],
    templateUrl: './add-card.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddCardComponent {
  currency = currency
}
