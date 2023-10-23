import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarProyectosComponent } from './administrar-proyectos.component';

describe('AdministrarProyectosComponent', () => {
  let component: AdministrarProyectosComponent;
  let fixture: ComponentFixture<AdministrarProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrarProyectosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrarProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
