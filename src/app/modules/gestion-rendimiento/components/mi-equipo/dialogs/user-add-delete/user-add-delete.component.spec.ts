import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddDeleteComponent } from './user-add-delete.component';

describe('UserAddDeleteComponent', () => {
  let component: UserAddDeleteComponent;
  let fixture: ComponentFixture<UserAddDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAddDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAddDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
