import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CustomerInvestComponent } from './customer-invest.component'

describe('CustomerInvestComponent', () => {
  let component: CustomerInvestComponent
  let fixture: ComponentFixture<CustomerInvestComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerInvestComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CustomerInvestComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
