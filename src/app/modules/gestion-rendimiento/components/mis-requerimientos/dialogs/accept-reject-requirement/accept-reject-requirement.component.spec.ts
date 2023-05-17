import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptRejectRequirementComponent } from './accept-reject-requirement.component';

describe('AcceptRejectRequirementComponent', () => {
  let component: AcceptRejectRequirementComponent;
  let fixture: ComponentFixture<AcceptRejectRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptRejectRequirementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptRejectRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
