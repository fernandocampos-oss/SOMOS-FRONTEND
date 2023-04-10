import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdjjConflictosInteresComponent } from './ddjj-conflictos-interes.component';

describe('DdjjConflictosInteresComponent', () => {
  let component: DdjjConflictosInteresComponent;
  let fixture: ComponentFixture<DdjjConflictosInteresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DdjjConflictosInteresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdjjConflictosInteresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
