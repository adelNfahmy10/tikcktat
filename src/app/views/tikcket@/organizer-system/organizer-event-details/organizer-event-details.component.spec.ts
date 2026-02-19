import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerEventDetailsComponent } from './organizer-event-details.component';

describe('OrganizerEventDetailsComponent', () => {
  let component: OrganizerEventDetailsComponent;
  let fixture: ComponentFixture<OrganizerEventDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerEventDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
