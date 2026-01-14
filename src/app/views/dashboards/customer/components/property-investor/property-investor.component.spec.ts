import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PropertyInvestorComponent } from './property-investor.component'

describe('PropertyInvestorComponent', () => {
  let component: PropertyInvestorComponent
  let fixture: ComponentFixture<PropertyInvestorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyInvestorComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(PropertyInvestorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
