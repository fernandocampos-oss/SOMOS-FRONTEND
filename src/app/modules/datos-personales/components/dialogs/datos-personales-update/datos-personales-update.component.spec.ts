import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPersonalesUpdateComponent } from './datos-personales-update.component';

describe('DatosPersonalesUpdateComponent', () => {
  let component: DatosPersonalesUpdateComponent;
  let fixture: ComponentFixture<DatosPersonalesUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosPersonalesUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosPersonalesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
