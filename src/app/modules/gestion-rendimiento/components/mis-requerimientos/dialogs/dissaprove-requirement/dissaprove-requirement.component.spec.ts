import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DissaproveRequirementComponent } from './dissaprove-requirement.component';

describe('DissaproveRequirementComponent', () => {
  let component: DissaproveRequirementComponent;
  let fixture: ComponentFixture<DissaproveRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DissaproveRequirementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DissaproveRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
