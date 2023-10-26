import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPreviaProyectoComponent } from './vista-previa-proyecto.component';

describe('VistaPreviaProyectoComponent', () => {
  let component: VistaPreviaProyectoComponent;
  let fixture: ComponentFixture<VistaPreviaProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaPreviaProyectoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaPreviaProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
