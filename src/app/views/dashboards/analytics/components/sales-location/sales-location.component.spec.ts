import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SalesLocationComponent } from './sales-location.component'

describe('SalesLocationComponent', () => {
  let component: SalesLocationComponent
  let fixture: ComponentFixture<SalesLocationComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesLocationComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SalesLocationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
