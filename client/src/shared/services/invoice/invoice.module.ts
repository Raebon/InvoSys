import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { InvoicesService } from "./invoice.service";

@NgModule({
  imports: [CommonModule],
  providers: [InvoicesService],
})
export class InvoiceModule {}
