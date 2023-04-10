import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaUnicaEmpleadoComponent } from './ficha-unica-empleado.component';

describe('DatosPersonalesTabComponent', () => {
  let component: FichaUnicaEmpleadoComponent;
  let fixture: ComponentFixture<FichaUnicaEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaUnicaEmpleadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaUnicaEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
