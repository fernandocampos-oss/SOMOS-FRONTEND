import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPublicacionComponent } from './show-publicacion.component';

describe('ShowPublicacionComponent', () => {
  let component: ShowPublicacionComponent;
  let fixture: ComponentFixture<ShowPublicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPublicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPublicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
