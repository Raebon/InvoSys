import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GetInvoicesService } from "./get-invoices.service";
import { GetLastThreeMonthsRevenueService } from "./get-last-three-months-revenue.service";
import { GetInvoiceByIdService } from "./get-invoice-by-id.service";
import { CreateInvoiceService } from "./create-invoice.service";
import { DeleteInvoiceService } from "./delete-invoice.service";
import { UpdateInvoiceService } from "./update-invoice.service";

@NgModule({
  imports: [CommonModule],
  providers: [
    GetInvoicesService,
    GetLastThreeMonthsRevenueService,
    GetInvoiceByIdService,
    CreateInvoiceService,
    DeleteInvoiceService,
    UpdateInvoiceService,
  ],
})
export class InvoiceModule {}
