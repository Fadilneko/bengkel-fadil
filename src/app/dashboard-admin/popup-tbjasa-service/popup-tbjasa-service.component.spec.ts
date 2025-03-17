import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTbjasaServiceComponent } from './popup-tbjasa-service.component';

describe('PopupTbjasaServiceComponent', () => {
  let component: PopupTbjasaServiceComponent;
  let fixture: ComponentFixture<PopupTbjasaServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupTbjasaServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupTbjasaServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
