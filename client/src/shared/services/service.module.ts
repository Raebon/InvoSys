import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { InvoiceModule } from "./invoice/invoice.module";
import { GraphqlModule } from "./graphql/graphql.module";

@NgModule({
  imports: [CommonModule],
  exports: [GraphqlModule, InvoiceModule],
})
export class ServicesModule {}
