import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTaskComponent } from './report-task.component';

describe('ReportTaskComponent', () => {
  let component: ReportTaskComponent;
  let fixture: ComponentFixture<ReportTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
