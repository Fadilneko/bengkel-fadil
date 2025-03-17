import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableKaryawanComponent } from './table-karyawan.component';

describe('TableKaryawanComponent', () => {
  let component: TableKaryawanComponent;
  let fixture: ComponentFixture<TableKaryawanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableKaryawanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableKaryawanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
