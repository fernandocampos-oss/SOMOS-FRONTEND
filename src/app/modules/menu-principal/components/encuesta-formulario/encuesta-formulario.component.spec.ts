import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaFormularioComponent } from './encuesta-formulario.component';

describe('EncuestaFormularioComponent', () => {
  let component: EncuestaFormularioComponent;
  let fixture: ComponentFixture<EncuestaFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncuestaFormularioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuestaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
