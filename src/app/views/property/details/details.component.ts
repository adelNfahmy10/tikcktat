import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { OwnerDetailComponent } from './components/owner-detail/owner-detail.component'
import { PropertyInfoComponent } from './components/property-info/property-info.component'

@Component({
    selector: 'app-details',
    imports: [PageTitleComponent, OwnerDetailComponent, PropertyInfoComponent],
    templateUrl: './details.component.html',
    styles: ``
})
export class DetailsComponent {}
