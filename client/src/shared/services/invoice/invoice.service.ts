import { Injectable } from "@angular/core";
import { GetInvoicesService } from "../graphql/invoice/get-invoices.service";
import { DocumentNode } from "graphql";
import { Observable, map } from "rxjs";
import { GetLastThreeMonthsRevenueService } from "../graphql/invoice/get-last-three-months-revenue.service";
import { GetInvoiceByIdService } from "../graphql/invoice/get-invoice-by-id.service";
import { CreateInvoiceService } from "../graphql/invoice/create-invoice.service";
import { DeleteInvoiceService } from "../graphql/invoice/delete-invoice.service";
import { UpdateInvoiceService } from "../graphql/invoice/update-invoice.service";

@Injectable({
  providedIn: "root",
})
export class InvoicesService {
  constructor(
    private getInvoicesService: GetInvoicesService,
    private getLastThreeMonthsRevenueService: GetLastThreeMonthsRevenueService,
    private getInvoiceByIdService: GetInvoiceByIdService,
    private createInvoiceService: CreateInvoiceService,
    private deleteInvoiceService: DeleteInvoiceService,
    private updateInvoiceService: UpdateInvoiceService
  ) {}

  createInvoice(
    input: IInvoiceInput,
    mutation: DocumentNode
  ): Observable<IInvoice | undefined> {
    return this.createInvoiceService.createInvoice(input, mutation).pipe(
      map((invoice) => {
        return invoice.data?.invoice.addInvoice;
      })
    );
  }

  updateInvoice(
    input: IInvoiceInput,
    mutation: DocumentNode
  ): Observable<IInvoice | undefined> {
    return this.updateInvoiceService.updateInvoice(input, mutation).pipe(
      map((invoice) => {
        return invoice.data?.invoice.updateInvoice;
      })
    );
  }

  deleteInvoice(
    input: string,
    mutation: DocumentNode
  ): Observable<DeleteInvoiceResponse | undefined> {
    return this.deleteInvoiceService.deleteInvoice(input, mutation).pipe(
      map((res) => {
        return res.data?.invoice.deleteInvoice;
      })
    );
  }

  getInvoices(params: IGetInvoicesBody, query: DocumentNode): Observable<any> {
    return this.getInvoicesService.getInvoices(params, query).valueChanges.pipe(
      map((invoice) => {
        return invoice.data.invoice.getInvoices;
      })
    );
  }

  getInvoiceById(params: string, query: DocumentNode): Observable<IInvoice> {
    return this.getInvoiceByIdService
      .getInvoiceById(params, query)
      .valueChanges.pipe(
        map((invoice) => {
          return invoice.data.invoice.getInvoiceById;
        })
      );
  }

  getLastThreeMonthsRevenue(query: DocumentNode): Observable<any> {
    return this.getLastThreeMonthsRevenueService
      .getLastThreeMonthsRevenue(query)
      .valueChanges.pipe(
        map((invoice) => {
          return invoice.data.invoice.getRevenueLastThreeMonths;
        })
      );
  }
}
