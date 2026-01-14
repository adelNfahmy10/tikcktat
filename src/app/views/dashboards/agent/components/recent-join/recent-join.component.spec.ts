import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RecentJoinComponent } from './recent-join.component'

describe('RecentJoinComponent', () => {
  let component: RecentJoinComponent
  let fixture: ComponentFixture<RecentJoinComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentJoinComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(RecentJoinComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
