import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveRequirementComponent } from './move-requirement.component';

describe('MoveRequirementComponent', () => {
  let component: MoveRequirementComponent;
  let fixture: ComponentFixture<MoveRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveRequirementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
