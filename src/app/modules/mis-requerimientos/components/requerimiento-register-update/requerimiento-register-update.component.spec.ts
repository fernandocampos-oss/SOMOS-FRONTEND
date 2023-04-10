import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequerimientoRegisterUpdateComponent } from './requerimiento-register-update.component';

describe('RequerimientoRegisterUpdateComponent', () => {
  let component: RequerimientoRegisterUpdateComponent;
  let fixture: ComponentFixture<RequerimientoRegisterUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequerimientoRegisterUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequerimientoRegisterUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
