import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPelangganComponent } from './header-pelanggan.component';

describe('HeaderPelangganComponent', () => {
  let component: HeaderPelangganComponent;
  let fixture: ComponentFixture<HeaderPelangganComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderPelangganComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderPelangganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
