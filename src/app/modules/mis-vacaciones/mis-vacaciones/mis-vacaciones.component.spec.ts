import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisVacacionesComponent } from './mis-vacaciones.component';

describe('MisVacacionesComponent', () => {
  let component: MisVacacionesComponent;
  let fixture: ComponentFixture<MisVacacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisVacacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisVacacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
