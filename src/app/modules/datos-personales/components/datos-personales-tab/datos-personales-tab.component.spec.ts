import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPersonalesTabComponent } from './datos-personales-tab.component';

describe('DatosPersonalesTabComponent', () => {
  let component: DatosPersonalesTabComponent;
  let fixture: ComponentFixture<DatosPersonalesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosPersonalesTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosPersonalesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
