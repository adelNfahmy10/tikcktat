import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerEventAttendeesComponent } from './organizer-event-attendees.component';

describe('OrganizerEventAttendeesComponent', () => {
  let component: OrganizerEventAttendeesComponent;
  let fixture: ComponentFixture<OrganizerEventAttendeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerEventAttendeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerEventAttendeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
