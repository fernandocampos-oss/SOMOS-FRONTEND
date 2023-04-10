import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraAdministrativaComponent } from './carrera-administrativa.component';

describe('CarreraAdministrativaComponent', () => {
  let component: CarreraAdministrativaComponent;
  let fixture: ComponentFixture<CarreraAdministrativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarreraAdministrativaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarreraAdministrativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
