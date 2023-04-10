import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComportamientoGeneralComponent } from './comportamiento-general.component';

describe('ComportamientoGeneralComponent', () => {
  let component: ComportamientoGeneralComponent;
  let fixture: ComponentFixture<ComportamientoGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComportamientoGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComportamientoGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
