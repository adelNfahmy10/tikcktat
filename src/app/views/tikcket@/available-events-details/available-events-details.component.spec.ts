import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableEventsDetailsComponent } from './available-events-details.component';

describe('AvailableEventsDetailsComponent', () => {
  let component: AvailableEventsDetailsComponent;
  let fixture: ComponentFixture<AvailableEventsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableEventsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableEventsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
