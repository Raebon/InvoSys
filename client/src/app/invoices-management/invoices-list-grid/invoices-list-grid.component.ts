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
  invoices: Invoice[];
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

  public getInvoicesData(): void {
    this.loading = true;
    this.graphqlService
      .getInvoices({
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

  public onSortingChange(event: SortOrder): void {
    this.sorting = event;
    this.getInvoicesData();
    //console.log(event);
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

  public calculateTotalPrice(invoiceItems: InvoiceItem[]): number {
    let totalPrice = 0;

    invoiceItems.forEach((item) => {
      totalPrice += item.numberOfItems * item.unitPrice;
    });

    return totalPrice;
  }

  public deleteInvoice(invoiceId: string): void {
    if (window.confirm(`Opravdu chcete odstranit fakturu?`)) {
      try {
        this.graphqlService.deleteInvoice(invoiceId).subscribe((data) => {
          this.notifyService.showSuccess(
            "Faktura byla úspěšně odstraněna",
            "Úspěšná akce!"
          );
          this.invoices = this.invoices.filter(
            (invoice) => invoice.id !== invoiceId
          );
        });
      } catch (error) {
        {
          this.notifyService.showError(
            "Faktura nebyla odstraněna",
            "Neúspěšná akce!"
          );
        }
      }
    }
  }
}
