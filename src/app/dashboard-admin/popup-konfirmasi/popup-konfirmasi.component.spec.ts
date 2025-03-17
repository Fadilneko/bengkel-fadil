import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupKonfirmasiComponent } from './popup-konfirmasi.component';

describe('PopupKonfirmasiComponent', () => {
  let component: PopupKonfirmasiComponent;
  let fixture: ComponentFixture<PopupKonfirmasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupKonfirmasiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupKonfirmasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
