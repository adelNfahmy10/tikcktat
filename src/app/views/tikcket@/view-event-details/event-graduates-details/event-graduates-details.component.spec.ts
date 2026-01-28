import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventGraduatesDetailsComponent } from './event-graduates-details.component';

describe('EventGraduatesDetailsComponent', () => {
  let component: EventGraduatesDetailsComponent;
  let fixture: ComponentFixture<EventGraduatesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventGraduatesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventGraduatesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
