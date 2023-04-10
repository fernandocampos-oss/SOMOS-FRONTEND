import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskRejectComponent } from './task-reject.component';

describe('TaskRejectComponent', () => {
  let component: TaskRejectComponent;
  let fixture: ComponentFixture<TaskRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskRejectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
