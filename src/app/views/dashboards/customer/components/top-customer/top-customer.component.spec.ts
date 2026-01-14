import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TopCustomerComponent } from './top-customer.component'

describe('TopCustomerComponent', () => {
  let component: TopCustomerComponent
  let fixture: ComponentFixture<TopCustomerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopCustomerComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TopCustomerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
