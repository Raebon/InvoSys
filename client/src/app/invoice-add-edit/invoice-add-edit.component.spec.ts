import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceAddEditComponent } from './invoice-add-edit.component';

describe('InvoiceAddEditComponent', () => {
  let component: InvoiceAddEditComponent;
  let fixture: ComponentFixture<InvoiceAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
