import { Component, OnInit } from "@angular/core";
import { GraphqlService } from "../../services/graphql.service";
import { finalize } from "rxjs";
import { NotificationService } from "src/app/services/notification.service";

@Component({
  selector: "app-invoices-list-grid",
  templateUrl: "./invoices-list-grid.component.html",
  styleUrls: ["./invoices-list-grid.component.css"],
})
export class InvoicesListGridComponent implements OnInit {
  invoices: Invoice[];
  loading: boolean;
  constructor(
    private graphqlService: GraphqlService,
    private notifyService: NotificationService
  ) {
    this.invoices = [];
    this.loading = false;
  }

  ngOnInit(): void {
    this.getInvoicesData();
  }

  public getInvoicesData(): void {
    this.loading = true;
    this.graphqlService
      .getInvoices()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((data) => {
        this.invoices = data.rows;
      });
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
