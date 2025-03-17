import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePelangganComponent } from './profile-pelanggan.component';

describe('ProfilePelangganComponent', () => {
  let component: ProfilePelangganComponent;
  let fixture: ComponentFixture<ProfilePelangganComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilePelangganComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePelangganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
