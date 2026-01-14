import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RecentAgentComponent } from './recent-agent.component'

describe('RecentAgentComponent', () => {
  let component: RecentAgentComponent
  let fixture: ComponentFixture<RecentAgentComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentAgentComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(RecentAgentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
