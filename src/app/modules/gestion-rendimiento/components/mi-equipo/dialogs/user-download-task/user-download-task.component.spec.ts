import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDownloadTaskComponent } from './user-download-task.component';

describe('UserDownloadTaskComponent', () => {
  let component: UserDownloadTaskComponent;
  let fixture: ComponentFixture<UserDownloadTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDownloadTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDownloadTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
