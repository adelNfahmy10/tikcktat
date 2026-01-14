import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SalesFunnelComponent } from './sales-funnel.component'

describe('SalesFunnelComponent', () => {
  let component: SalesFunnelComponent
  let fixture: ComponentFixture<SalesFunnelComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesFunnelComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SalesFunnelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
