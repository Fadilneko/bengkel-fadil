import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRiwayatComponent } from './table-riwayat.component';

describe('TableRiwayatComponent', () => {
  let component: TableRiwayatComponent;
  let fixture: ComponentFixture<TableRiwayatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableRiwayatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableRiwayatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
