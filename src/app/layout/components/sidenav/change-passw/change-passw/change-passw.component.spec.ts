import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswComponent } from './change-passw.component';

describe('ChangePasswComponent', () => {
  let component: ChangePasswComponent;
  let fixture: ComponentFixture<ChangePasswComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePasswComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
