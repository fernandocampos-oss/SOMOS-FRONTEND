import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemuneracionesBonificacionesBeneficiosComponent } from './remuneraciones-bonificaciones-beneficios.component';

describe('RemuneracionesBonificacionesBeneficiosComponent', () => {
  let component: RemuneracionesBonificacionesBeneficiosComponent;
  let fixture: ComponentFixture<RemuneracionesBonificacionesBeneficiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemuneracionesBonificacionesBeneficiosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemuneracionesBonificacionesBeneficiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
