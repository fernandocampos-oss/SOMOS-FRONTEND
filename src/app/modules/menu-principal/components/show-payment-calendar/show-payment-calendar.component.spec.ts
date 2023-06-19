import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPaymentCalendarComponent } from './show-payment-calendar.component';

describe('ShowPaymentCalendarComponent', () => {
  let component: ShowPaymentCalendarComponent;
  let fixture: ComponentFixture<ShowPaymentCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPaymentCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPaymentCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
