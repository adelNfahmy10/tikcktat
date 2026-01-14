import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'

@Component({
    selector: 'app-badge',
    imports: [PageTitleComponent, UIExamplesListComponent],
    templateUrl: './badge.component.html',
    styles: ``
})
export class BadgeComponent {}
