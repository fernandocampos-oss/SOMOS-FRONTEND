import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdatePublicacionComponent } from './add-update-publicacion.component';

describe('AddUpdatePublicacionComponent', () => {
  let component: AddUpdatePublicacionComponent;
  let fixture: ComponentFixture<AddUpdatePublicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdatePublicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdatePublicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
