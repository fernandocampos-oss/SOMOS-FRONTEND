import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdjjImpedimentoLaboralComponent } from './ddjj-impedimento-laboral.component';

describe('DdjjImpedimentoLaboralComponent', () => {
  let component: DdjjImpedimentoLaboralComponent;
  let fixture: ComponentFixture<DdjjImpedimentoLaboralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DdjjImpedimentoLaboralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdjjImpedimentoLaboralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
