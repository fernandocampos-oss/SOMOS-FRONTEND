import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDatosEncuestaComponent } from './register-datos-encuesta.component';

describe('RegisterDatosEncuestaComponent', () => {
  let component: RegisterDatosEncuestaComponent;
  let fixture: ComponentFixture<RegisterDatosEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterDatosEncuestaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterDatosEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
