import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdjjConflictosComponent } from './ddjj-conflictos.component';

describe('DdjjConflictosComponent', () => {
  let component: DdjjConflictosComponent;
  let fixture: ComponentFixture<DdjjConflictosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DdjjConflictosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdjjConflictosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
