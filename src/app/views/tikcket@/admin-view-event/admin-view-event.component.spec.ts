import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewEventComponent } from './admin-view-event.component';

describe('AdminViewEventComponent', () => {
  let component: AdminViewEventComponent;
  let fixture: ComponentFixture<AdminViewEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
