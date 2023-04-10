import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadRequirementComponent } from './read-requirement.component';

describe('ReadRequirementComponent', () => {
  let component: ReadRequirementComponent;
  let fixture: ComponentFixture<ReadRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadRequirementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
