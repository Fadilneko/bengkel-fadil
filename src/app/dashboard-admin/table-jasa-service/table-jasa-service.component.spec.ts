import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableJasaServiceComponent } from './table-jasa-service.component';

describe('TableJasaServiceComponent', () => {
  let component: TableJasaServiceComponent;
  let fixture: ComponentFixture<TableJasaServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableJasaServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableJasaServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
