import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SessionByCountryComponent } from './session-by-country.component'

describe('SessionByCountryComponent', () => {
  let component: SessionByCountryComponent
  let fixture: ComponentFixture<SessionByCountryComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionByCountryComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SessionByCountryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
