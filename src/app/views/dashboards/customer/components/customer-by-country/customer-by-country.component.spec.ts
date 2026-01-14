import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CustomerByCountryComponent } from './customer-by-country.component'

describe('CustomerByCountryComponent', () => {
  let component: CustomerByCountryComponent
  let fixture: ComponentFixture<CustomerByCountryComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerByCountryComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CustomerByCountryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
