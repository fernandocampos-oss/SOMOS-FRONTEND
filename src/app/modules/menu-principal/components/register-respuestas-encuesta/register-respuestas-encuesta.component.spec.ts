import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRespuestasEncuestaComponent } from './register-respuestas-encuesta.component';

describe('RegisterRespuestasEncuestaComponent', () => {
  let component: RegisterRespuestasEncuestaComponent;
  let fixture: ComponentFixture<RegisterRespuestasEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterRespuestasEncuestaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterRespuestasEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
