import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSparepartComponent } from './table-sparepart.component';

describe('TableSparepartComponent', () => {
  let component: TableSparepartComponent;
  let fixture: ComponentFixture<TableSparepartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableSparepartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableSparepartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
