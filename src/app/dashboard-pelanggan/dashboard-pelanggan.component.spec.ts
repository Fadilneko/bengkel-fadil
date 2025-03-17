import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPelangganComponent } from './dashboard-pelanggan.component';

describe('DashboardPelangganComponent', () => {
  let component: DashboardPelangganComponent;
  let fixture: ComponentFixture<DashboardPelangganComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardPelangganComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPelangganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
