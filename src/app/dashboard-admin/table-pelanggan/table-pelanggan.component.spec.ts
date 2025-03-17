import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePelangganComponent } from './table-pelanggan.component';

describe('TablePelangganComponent', () => {
  let component: TablePelangganComponent;
  let fixture: ComponentFixture<TablePelangganComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablePelangganComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablePelangganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
