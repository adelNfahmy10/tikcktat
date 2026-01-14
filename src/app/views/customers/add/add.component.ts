import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { CustomerCardComponent } from './components/customer-card/customer-card.component'
import { CustomerInfoComponent } from './components/customer-info/customer-info.component'
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component'

@Component({
    selector: 'app-add',
    imports: [
        PageTitleComponent,
        CustomerCardComponent,
        CustomerInfoComponent,
        FileUploaderComponent,
    ],
    templateUrl: './add.component.html',
    styles: ``
})
export class AddComponent {}
