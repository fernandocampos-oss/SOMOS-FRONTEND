import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSstComponent } from './show-sst.component';

describe('ShowSstComponent', () => {
  let component: ShowSstComponent;
  let fixture: ComponentFixture<ShowSstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowSstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
