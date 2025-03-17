import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRiwayatComponent } from './detail-riwayat.component';

describe('DetailRiwayatComponent', () => {
  let component: DetailRiwayatComponent;
  let fixture: ComponentFixture<DetailRiwayatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailRiwayatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailRiwayatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
