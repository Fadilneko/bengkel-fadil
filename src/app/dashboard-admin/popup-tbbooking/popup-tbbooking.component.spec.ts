import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupTbbookingComponent } from './popup-tbbooking.component';

describe('PopupTbbookingComponent', () => {
  let component: PopupTbbookingComponent;
  let fixture: ComponentFixture<PopupTbbookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupTbbookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupTbbookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
