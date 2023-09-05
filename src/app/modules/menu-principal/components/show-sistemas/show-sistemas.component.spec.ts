import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSistemasComponent } from './show-sistemas.component';

describe('ShowSistemasComponent', () => {
  let component: ShowSistemasComponent;
  let fixture: ComponentFixture<ShowSistemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowSistemasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowSistemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
