import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableKendaraanComponent } from './table-kendaraan.component';

describe('TableKendaraanComponent', () => {
  let component: TableKendaraanComponent;
  let fixture: ComponentFixture<TableKendaraanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableKendaraanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableKendaraanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
