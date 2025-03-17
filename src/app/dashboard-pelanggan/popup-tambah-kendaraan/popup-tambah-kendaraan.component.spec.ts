import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTambahKendaraanComponent } from './popup-tambah-kendaraan.component';

describe('PopupTambahKendaraanComponent', () => {
  let component: PopupTambahKendaraanComponent;
  let fixture: ComponentFixture<PopupTambahKendaraanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupTambahKendaraanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupTambahKendaraanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
