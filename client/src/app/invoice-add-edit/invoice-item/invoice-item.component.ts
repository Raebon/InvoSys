import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-invoice-item",
  templateUrl: "./invoice-item.component.html",
})
export class InvoiceItemComponent implements OnInit {
  @Output() itemValuesChange = new EventEmitter<{
    item: InvoiceItem;
    index: number;
  }>();
  @Output() deleteItem = new EventEmitter<number>();
  @Input() item!: InvoiceItem;
  @Input() index!: number;

  invoiceItem = new FormGroup({
    name: new FormControl<string>(""),
    numberOfItems: new FormControl<number>(0),
    unitPrice: new FormControl<number>(0),
  });
  constructor() {}

  ngOnInit(): void {
    this.onChangeValues();
    this.updateFormValuesFromInput();
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
        item: {
          numberOfItems: res.numberOfItems ?? 0,
          name: res.name ?? "",
          unitPrice: res.unitPrice ?? 0,
        },
        index: this.index,
      });
    });
  }

  public onDeleteItem(item: InvoiceItem): void {
    this.deleteItem.emit(this.index);
  }
}
