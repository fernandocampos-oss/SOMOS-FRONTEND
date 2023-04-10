import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioRegisterUpdateDialog } from './usuario-register-update.dialog';

describe('UsuarioRegisterUpdateDialog', () => {
  let component: UsuarioRegisterUpdateDialog;
  let fixture: ComponentFixture<UsuarioRegisterUpdateDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsuarioRegisterUpdateDialog],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioRegisterUpdateDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
