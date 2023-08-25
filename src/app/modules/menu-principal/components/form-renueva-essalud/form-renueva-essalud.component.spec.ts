import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRenuevaEssaludComponent } from './form-renueva-essalud.component';

describe('FormRenuevaEssaludComponent', () => {
  let component: FormRenuevaEssaludComponent;
  let fixture: ComponentFixture<FormRenuevaEssaludComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRenuevaEssaludComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRenuevaEssaludComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
