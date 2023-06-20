import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-paginator",
  templateUrl: "./paginator.component.html",
})
export class PaginatorComponent {
  @Input() currentPage!: number;
  @Input() pageSize!: number;
  @Input() totalItems!: number;

  @Output() pageChange = new EventEmitter<{
    currentPage: number;
    pageSize: number;
  }>();

  pageSizes: number[];
  constructor() {
    this.pageSizes = [1, 5, 10, 25, 50];
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  onSelectChange(event: number): void {
    this.pageChange.emit({
      currentPage: this.currentPage,
      pageSize: event,
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit({
        currentPage: this.currentPage - 1,
        pageSize: this.pageSize,
      });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit({
        currentPage: this.currentPage + 1,
        pageSize: this.pageSize,
      });
    }
  }
}
