import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileKaryawanComponent } from './profile-karyawan.component';

describe('ProfileKaryawanComponent', () => {
  let component: ProfileKaryawanComponent;
  let fixture: ComponentFixture<ProfileKaryawanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileKaryawanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileKaryawanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
