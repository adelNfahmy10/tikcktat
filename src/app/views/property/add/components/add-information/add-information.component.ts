import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive'

@Component({
    selector: 'add-information',
    imports: [SelectFormInputDirective],
    templateUrl: './add-information.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddInformationComponent {}
