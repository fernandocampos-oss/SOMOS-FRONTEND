import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaUnicaPersonalComponent } from './ficha-unica-personal.component';

describe('FichaUnicaPersonalComponent', () => {
  let component: FichaUnicaPersonalComponent;
  let fixture: ComponentFixture<FichaUnicaPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaUnicaPersonalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaUnicaPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
