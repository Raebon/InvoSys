import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Component({
  selector: "app-sortable-column",
  templateUrl: "./sortable-column.component.html",
})
export class SortableColumnComponent {
  @Input() title!: string;
  @Input() sortingKey: "ASC" | "DESC" | undefined = undefined;
  @Input() key!: string;
  @Input() activeKey: string | undefined = undefined;
  @Input() class?: string = "flex gap-2";

  @Output() sortingChange = new EventEmitter<SortOrder>();
  constructor() {}

  ngOnInit(): void {}

  get isActive(): boolean {
    return this.activeKey === this.key;
  }

  public onSortingChange(): void {
    if (!this.key) {
      console.log("Není přiřazen sorting key");
      return;
    }
    this.sortingKey = this.toggleSortingKey(this.sortingKey);
    let order: SortOrder = {
      field: this.key,
      direction: this.sortingKey,
    };
    this.sortingChange.emit(order);
  }

  public toggleSortingKey(currentKey?: "ASC" | "DESC"): "ASC" | "DESC" {
    if (!currentKey) return "ASC";
    return currentKey === "ASC" ? "DESC" : "ASC";
  }
}
