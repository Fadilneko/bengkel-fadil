import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTbpelangganComponent } from './popup-tbpelanggan.component';

describe('PopupTbpelangganComponent', () => {
  let component: PopupTbpelangganComponent;
  let fixture: ComponentFixture<PopupTbpelangganComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupTbpelangganComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupTbpelangganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
