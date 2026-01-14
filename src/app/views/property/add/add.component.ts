import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { AddCardComponent } from './components/add-card/add-card.component'
import { AddInformationComponent } from './components/add-information/add-information.component'
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component'

@Component({
    selector: 'app-add',
    imports: [
        PageTitleComponent,
        AddCardComponent,
        AddInformationComponent,
        FileUploaderComponent,
    ],
    templateUrl: './add.component.html',
    styles: ``
})
export class AddComponent {}
