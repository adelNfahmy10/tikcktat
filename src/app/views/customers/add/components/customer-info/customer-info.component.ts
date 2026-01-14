import { Component } from '@angular/core'
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive'

@Component({
    selector: 'customer-info',
    imports: [SelectFormInputDirective],
    templateUrl: './customer-info.component.html',
    styles: ``
})
export class CustomerInfoComponent {}
