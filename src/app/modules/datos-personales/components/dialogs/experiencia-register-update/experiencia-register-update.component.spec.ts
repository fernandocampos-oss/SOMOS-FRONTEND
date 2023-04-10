import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienciaRegisterUpdateComponent } from './experiencia-register-update.component';

describe('ExperienciaRegisterUpdateComponent', () => {
  let component: ExperienciaRegisterUpdateComponent;
  let fixture: ComponentFixture<ExperienciaRegisterUpdateComponent>;
ExperienciaRegisterUpdateComponent
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperienciaRegisterUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienciaRegisterUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
