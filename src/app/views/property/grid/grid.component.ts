import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { PropertyFilterComponent } from './components/property-filter/property-filter.component'
import { PropertyDataComponent } from './components/property-data/property-data.component'

@Component({
    selector: 'app-grid',
    imports: [PageTitleComponent, PropertyFilterComponent, PropertyDataComponent],
    templateUrl: './grid.component.html',
    styles: ``
})
export class GridComponent {}
