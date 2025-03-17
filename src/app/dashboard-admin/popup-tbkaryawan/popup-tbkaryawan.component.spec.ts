import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTbkaryawanComponent } from './popup-tbkaryawan.component';

describe('PopupTbkaryawanComponent', () => {
  let component: PopupTbkaryawanComponent;
  let fixture: ComponentFixture<PopupTbkaryawanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupTbkaryawanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupTbkaryawanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
