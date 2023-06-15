import { Component, OnInit } from "@angular/core";
import { GraphqlService } from "../../services/graphql.service";
import { finalize } from "rxjs";

@Component({
  selector: "app-invoices-list-grid",
  templateUrl: "./invoices-list-grid.component.html",
  styleUrls: ["./invoices-list-grid.component.css"],
})
export class InvoicesListGridComponent implements OnInit {
  invoices: Invoice[] = [];
  loading: boolean = false;
  constructor(private graphqlService: GraphqlService) {}

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
}
