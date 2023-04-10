import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminoCarreraComponent } from './termino-carrera.component';

describe('TerminoCarreraComponent', () => {
  let component: TerminoCarreraComponent;
  let fixture: ComponentFixture<TerminoCarreraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminoCarreraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminoCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
