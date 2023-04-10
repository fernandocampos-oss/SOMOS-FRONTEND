import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationParentescoComponent } from './notification-parentesco.component';

describe('NotificationParentescoComponent', () => {
  let component: NotificationParentescoComponent;
  let fixture: ComponentFixture<NotificationParentescoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationParentescoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationParentescoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
