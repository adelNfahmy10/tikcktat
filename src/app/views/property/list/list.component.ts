import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { PropertyDataComponent } from './components/property-data/property-data.component'
import { PropertyStateComponent } from './components/property-state/property-state.component'
import { propertyStatData } from './data'

@Component({
    selector: 'app-list',
    imports: [PageTitleComponent, PropertyStateComponent, PropertyDataComponent],
    templateUrl: './list.component.html',
    styles: ``
})
export class ListComponent {
  stateList = propertyStatData
}
