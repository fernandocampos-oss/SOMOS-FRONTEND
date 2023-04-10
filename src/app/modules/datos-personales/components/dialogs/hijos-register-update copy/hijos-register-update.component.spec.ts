import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HijosRegisterUpdateComponent } from './hijos-register-update.component';

describe('HijosRegisterUpdateComponent', () => {
  let component: HijosRegisterUpdateComponent;
  let fixture: ComponentFixture<HijosRegisterUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HijosRegisterUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HijosRegisterUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
