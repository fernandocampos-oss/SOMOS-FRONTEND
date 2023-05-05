import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRegisterEncuestaComponent } from './confirm-register-encuesta.component';

describe('ConfirmRegisterEncuestaComponent', () => {
  let component: ConfirmRegisterEncuestaComponent;
  let fixture: ComponentFixture<ConfirmRegisterEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmRegisterEncuestaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRegisterEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
