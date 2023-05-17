import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTaskUserComponent } from './assign-task-user.component';

describe('AssignTaskUserComponent', () => {
  let component: AssignTaskUserComponent;
  let fixture: ComponentFixture<AssignTaskUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignTaskUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignTaskUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
