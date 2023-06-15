import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { Observable, map } from "rxjs";
import { CREATE_INVOICE, UPDATE_INVOICE } from "./utils/mutation";
import {
  GET_INVOICES,
  GET_LAST_THREE_MONTHS_REVENUE,
  GET_INVOICE_BY_ID,
} from "./utils/queries";
@Injectable({
  providedIn: "root",
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  public getInvoices(): Observable<InvoiceResult> {
    return this.apollo
      .query<InvoiceResult>({
        query: GET_INVOICES,
      })
      .pipe(map((result: { data: any }) => result.data.invoices));
  }

  public getLastThreeMonthsRevenue(): Observable<
    RevenueLastThreeMonthsResult[]
  > {
    return this.apollo
      .query<RevenueLastThreeMonthsResult[]>({
        query: GET_LAST_THREE_MONTHS_REVENUE,
      })
      .pipe(map((result: { data: any }) => result.data.lastThreeMonthsRevenue));
  }

  public getInvoiceById(id: string): Observable<GetInvoiceResult> {
    return this.apollo
      .query<GetInvoiceResult>({
        query: GET_INVOICE_BY_ID,
        variables: {
          getInvoiceByIdId: id,
        },
      })
      .pipe(map((result: { data: any }) => result.data.getInvoiceById));
  }

  public createInvoice(invoiceInput: AddInvoiceInput): Observable<any> {
    return this.apollo
      .mutate({
        mutation: CREATE_INVOICE,
        variables: { input: invoiceInput },
      })
      .pipe(
        map((res) => {
          this.invalidateCache();
          return res.data;
        })
      );
  }

  public updateInvoice(invoiceInput: UpdateInvoiceInput): Observable<any> {
    return this.apollo
      .mutate({
        mutation: UPDATE_INVOICE,
        variables: { input: invoiceInput },
      })
      .pipe(
        map((res) => {
          this.invalidateCache();
          return res.data;
        })
      );
  }

  public invalidateCache() {
    this.apollo.client.cache.reset();
  }
}
