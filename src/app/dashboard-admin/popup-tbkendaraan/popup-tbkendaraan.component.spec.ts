import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTbkendaraanComponent } from './popup-tbkendaraan.component';

describe('PopupTbkendaraanComponent', () => {
  let component: PopupTbkendaraanComponent;
  let fixture: ComponentFixture<PopupTbkendaraanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupTbkendaraanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupTbkendaraanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
