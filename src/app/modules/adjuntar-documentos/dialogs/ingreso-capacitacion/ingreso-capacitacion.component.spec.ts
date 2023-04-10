import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoCapacitacionComponent } from './ingreso-capacitacion.component';

describe('IngresoCapacitacionComponent', () => {
  let component: IngresoCapacitacionComponent;
  let fixture: ComponentFixture<IngresoCapacitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresoCapacitacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoCapacitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
