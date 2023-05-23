import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmPublicaciones } from './adm-publicaciones.component';

describe('AdmPublicaciones', () => {
  let component: AdmPublicaciones;
  let fixture: ComponentFixture<AdmPublicaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmPublicaciones ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmPublicaciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
