import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducacionRegisterUpdateComponent } from './educacion-register-update.component';

describe('EducacionRegisterUpdateComponent', () => {
  let component: EducacionRegisterUpdateComponent;
  let fixture: ComponentFixture<EducacionRegisterUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducacionRegisterUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducacionRegisterUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
