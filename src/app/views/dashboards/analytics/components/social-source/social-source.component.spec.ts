import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SocialSourceComponent } from './social-source.component'

describe('SocialSourceComponent', () => {
  let component: SocialSourceComponent
  let fixture: ComponentFixture<SocialSourceComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialSourceComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(SocialSourceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
