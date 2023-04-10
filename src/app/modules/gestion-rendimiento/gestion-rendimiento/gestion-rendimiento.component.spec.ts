import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRendimientoComponent } from './gestion-rendimiento.component';

describe('GestionRendimientoComponent', () => {
  let component: GestionRendimientoComponent;
  let fixture: ComponentFixture<GestionRendimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionRendimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionRendimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
