import { Component } from '@angular/core'
import { PageTitleComponent } from '@component/page-title.component'
import { StatisticsComponent } from './components/statistics/statistics.component'
import { SalesFunnelComponent } from './components/sales-funnel/sales-funnel.component'
import { RevenueComponent } from './components/revenue/revenue.component'
import { TopAgentComponent } from './components/top-agent/top-agent.component'
import { RecentAgentComponent } from './components/recent-agent/recent-agent.component'
import { GoalsComponent } from './components/goals/goals.component'
import { CollectionComponent } from './components/collection/collection.component'
import { SessionByCountryComponent } from './components/session-by-country/session-by-country.component'
import { RecentJoinComponent } from './components/recent-join/recent-join.component'

@Component({
    selector: 'app-agent',
    imports: [
        PageTitleComponent,
        StatisticsComponent,
        SalesFunnelComponent,
        RevenueComponent,
        TopAgentComponent,
        RecentAgentComponent,
        GoalsComponent,
        CollectionComponent,
        SessionByCountryComponent,
        RecentJoinComponent,
    ],
    templateUrl: './agent.component.html',
    styles: ``
})
export class AgentComponent {}
