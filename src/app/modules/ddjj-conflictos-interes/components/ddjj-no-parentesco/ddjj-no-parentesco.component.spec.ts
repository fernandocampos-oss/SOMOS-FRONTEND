import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdjjNoParentescoComponent } from './ddjj-no-parentesco.component';

describe('DdjjNoParentescoComponent', () => {
  let component: DdjjNoParentescoComponent;
  let fixture: ComponentFixture<DdjjNoParentescoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DdjjNoParentescoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdjjNoParentescoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
