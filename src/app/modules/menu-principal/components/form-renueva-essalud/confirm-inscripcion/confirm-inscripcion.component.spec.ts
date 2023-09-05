import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmInscripcionComponent } from './confirm-inscripcion.component';

describe('ConfirmInscripcionComponent', () => {
  let component: ConfirmInscripcionComponent;
  let fixture: ComponentFixture<ConfirmInscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmInscripcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmInscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
