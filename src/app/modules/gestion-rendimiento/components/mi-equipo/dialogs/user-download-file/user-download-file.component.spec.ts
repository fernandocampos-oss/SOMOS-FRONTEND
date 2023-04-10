import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDownloadFileComponent } from './user-download-file.component';

describe('UserDownloadFileComponent', () => {
  let component: UserDownloadFileComponent;
  let fixture: ComponentFixture<UserDownloadFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDownloadFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDownloadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
