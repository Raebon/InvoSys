import { Component, OnInit, Injector } from "@angular/core";
import { finalize } from "rxjs";
import { AppComponentBase } from "src/shared/app-component-base";

@Component({
  selector: "app-invoices-list-grid",
  templateUrl: "./invoices-list-grid.component.html",
  styleUrls: ["./invoices-list-grid.component.css"],
})
export class InvoicesListGridComponent
  extends AppComponentBase
  implements OnInit
{
  invoices: IInvoice[];
  loading: boolean;
  pageInfo: PaginationInfo;
  sorting?: SortOrder;
  constructor(injector: Injector) {
    super(injector);
    this.invoices = [];
    this.loading = false;
    this.pageInfo = {
      currentPage: 1,
      pageSize: 10,
      totalItems: 3,
    };
  }

  ngOnInit(): void {
    this.getInvoicesData();
  }

  public getInvoicesData(filterText?: string): void {
    this.loading = true;
    this.graphqlService
      .getInvoices({
        filterText,
        order: this.sorting,
        pageSize: this.pageInfo.pageSize,
        currentPage: this.pageInfo.currentPage,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((data) => {
        this.invoices = data.rows;
        this.pageInfo.totalItems = data.count;
      });
  }

  public search(filterText: string): void {
    this.getInvoicesData(filterText);
  }

  public onSortingChange(event: SortOrder): void {
    this.sorting = event;
    this.getInvoicesData();
  }

  public onPageChange({
    currentPage,
    pageSize,
  }: {
    currentPage: number;
    pageSize: number;
  }) {
    this.pageInfo.currentPage = currentPage;
    this.pageInfo.pageSize = pageSize;
    this.getInvoicesData();
  }

  public calculateTotalPrice(invoiceItems: IInvoiceItem[]): number {
    let totalPrice = 0;

    invoiceItems.forEach((item) => {
      totalPrice += item.numberOfItems * item.unitPrice;
    });

    return totalPrice;
  }

  public deleteInvoice(invoiceId: string): void {
    this.invoices = this.invoices.filter((invoice) => invoice.id !== invoiceId);
  }

  public isInvoiceValid(invoice: IInvoice): boolean {
    let badInvoiceInputs: string[] = [];
    Object.entries(invoice).forEach(([key, value]) => {
      if (!value) {
        badInvoiceInputs.push(key);
      }
    });
    return badInvoiceInputs.length === 0;
  }
}
