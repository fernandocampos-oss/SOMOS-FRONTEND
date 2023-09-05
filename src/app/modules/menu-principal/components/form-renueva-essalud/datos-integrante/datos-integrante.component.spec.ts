import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosIntegranteComponent } from './datos-integrante.component';

describe('DatosIntegranteComponent', () => {
  let component: DatosIntegranteComponent;
  let fixture: ComponentFixture<DatosIntegranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosIntegranteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosIntegranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
