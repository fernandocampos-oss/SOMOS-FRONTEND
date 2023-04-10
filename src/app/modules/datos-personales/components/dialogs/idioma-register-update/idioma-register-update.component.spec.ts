import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdiomaRegisterUpdateComponent } from './idioma-register-update.component';

describe('IdiomaRegisterUpdateComponent', () => {
  let component: IdiomaRegisterUpdateComponent;
  let fixture: ComponentFixture<IdiomaRegisterUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdiomaRegisterUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdiomaRegisterUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
