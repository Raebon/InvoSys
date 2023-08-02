import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InvoiceModule } from "./invoice/invoice.module";
import { CustomerModule } from "./customer/customer.module";

@NgModule({
  imports: [CommonModule],
  exports: [InvoiceModule, CustomerModule],
})
export class GraphqlModule {}
