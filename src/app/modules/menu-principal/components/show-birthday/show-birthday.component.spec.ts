import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBirthdayComponent } from './show-birthday.component';

describe('ShowBirthdayComponent', () => {
  let component: ShowBirthdayComponent;
  let fixture: ComponentFixture<ShowBirthdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowBirthdayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowBirthdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
