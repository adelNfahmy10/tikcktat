import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component'

@Component({
    selector: 'app-basic',
    imports: [PageTitleComponent, UIExamplesListComponent],
    templateUrl: './basic.component.html',
    styles: ``
})
export class BasicComponent {}
