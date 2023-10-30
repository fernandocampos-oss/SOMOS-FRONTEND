import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarInscripcionComponent } from './administrar-inscripcion.component';

describe('AdministrarInscripcionComponent', () => {
  let component: AdministrarInscripcionComponent;
  let fixture: ComponentFixture<AdministrarInscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrarInscripcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrarInscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
