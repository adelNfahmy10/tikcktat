import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetuserpasswordComponent } from './resetuserpassword.component';

describe('ResetuserpasswordComponent', () => {
  let component: ResetuserpasswordComponent;
  let fixture: ComponentFixture<ResetuserpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetuserpasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetuserpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
