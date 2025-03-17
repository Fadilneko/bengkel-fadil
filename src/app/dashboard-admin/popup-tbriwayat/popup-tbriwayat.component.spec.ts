import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTbriwayatComponent } from './popup-tbriwayat.component';

describe('PopupTbriwayatComponent', () => {
  let component: PopupTbriwayatComponent;
  let fixture: ComponentFixture<PopupTbriwayatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupTbriwayatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupTbriwayatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
