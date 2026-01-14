import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive'
import { NouisliderModule } from 'ng2-nouislider'

@Component({
    selector: 'property-filter',
    imports: [SelectFormInputDirective, NouisliderModule, FormsModule],
    templateUrl: './property-filter.component.html',
    styles: ``
})
export class PropertyFilterComponent {
  someRange = [6000, 100000]

  rangeConfig = {
    start: [6000, 100000],
    step: 1,
    margin: 0,
    connect: true,
    behaviour: 'tap-drag',
    range: {
      min: 0,
      max: 120000,
    },
  }
}
