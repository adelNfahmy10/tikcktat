import { Component } from '@angular/core'
import { customersCountryData } from '../../data'
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'
import { currency } from '@common/constants'

@Component({
    selector: 'customer-state',
    imports: [NgbProgressbarModule],
    templateUrl: './state.component.html',
    styles: ``
})
export class StateComponent {
  currency = currency
  stateList = customersCountryData
}
