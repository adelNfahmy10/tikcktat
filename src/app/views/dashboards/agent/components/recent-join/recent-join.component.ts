import { Component } from '@angular/core'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { joinAgent } from '../../data'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'agent-recent-join',
    imports: [NgbDropdownModule, CommonModule],
    templateUrl: './recent-join.component.html',
    styles: ``
})
export class RecentJoinComponent {
  agentList = joinAgent
}
