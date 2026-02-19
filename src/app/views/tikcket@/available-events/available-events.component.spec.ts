import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableEventsComponent } from './available-events.component';

describe('AvailableEventsComponent', () => {
  let component: AvailableEventsComponent;
  let fixture: ComponentFixture<AvailableEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
