import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTbsparepartComponent } from './popup-tbsparepart.component';

describe('PopupTbsparepartComponent', () => {
  let component: PopupTbsparepartComponent;
  let fixture: ComponentFixture<PopupTbsparepartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupTbsparepartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupTbsparepartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
