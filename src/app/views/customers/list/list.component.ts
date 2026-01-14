import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { customerData } from '../data'
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap'

@Component({
    selector: 'app-list',
    imports: [PageTitleComponent, NgbPaginationModule, NgbDropdownModule],
    templateUrl: './list.component.html',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListComponent {
  customerList = customerData
}
