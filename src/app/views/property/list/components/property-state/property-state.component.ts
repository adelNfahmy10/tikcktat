import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'
import type { PropertyStatType } from '../../data'

@Component({
    selector: 'property-state',
    imports: [],
    templateUrl: './property-state.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PropertyStateComponent {
  @Input() item!: PropertyStatType
}
