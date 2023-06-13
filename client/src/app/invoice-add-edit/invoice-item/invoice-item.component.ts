import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-invoice-item',
  templateUrl: './invoice-item.component.html',
})
export class InvoiceItemComponent implements OnInit {
  @Output() itemValuesChange = new EventEmitter<InvoiceItem>();
  @Output() deleteItem = new EventEmitter<string>();
  @Input() item: InvoiceItem = {
    id: '',
    invoiceId: '',
    numberOfItems: 0,
    name: '',
    unitPrice: 0,
  };

  invoiceItem = new FormGroup({
    name: new FormControl<string>(''),
    numberOfItems: new FormControl<number>(0),
    unitPrice: new FormControl<number>(0),
  });
  constructor() {}

  ngOnInit(): void {
    this.updateFormValuesFromInput();
    this.onChangeValues();
  }

  public updateFormValuesFromInput(): void {
    this.invoiceItem.patchValue({
      name: this.item.name,
      numberOfItems: this.item.numberOfItems,
      unitPrice: this.item.unitPrice,
    });
  }

  public onChangeValues(): void {
    this.invoiceItem.valueChanges.subscribe((res) => {
      this.itemValuesChange.emit({
        id: this.item.id,
        invoiceId: this.item.invoiceId,
        numberOfItems: res.numberOfItems ?? 0,
        name: res.name ?? '',
        unitPrice: res.unitPrice ?? 0,
      });
    });
  }

  public onDeleteItem(itemId: string): void {
    this.deleteItem.emit(itemId);
  }
}
