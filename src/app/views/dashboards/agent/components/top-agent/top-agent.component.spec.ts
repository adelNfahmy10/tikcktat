import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TopAgentComponent } from './top-agent.component'

describe('TopAgentComponent', () => {
  let component: TopAgentComponent
  let fixture: ComponentFixture<TopAgentComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopAgentComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TopAgentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
