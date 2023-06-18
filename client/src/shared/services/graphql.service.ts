import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { Observable, map } from "rxjs";
import {
  CREATE_INVOICE,
  UPDATE_INVOICE,
  DELETE_INVOICE,
} from "./utils/mutation";
import {
  GET_INVOICES,
  GET_LAST_THREE_MONTHS_REVENUE,
  GET_INVOICE_BY_ID,
  SEARCH_CUSTOMERS,
} from "./utils/queries";

type SearchCustomerResponse = {
  searchCustomers: CustomerResult;
};

type GetInvoicesResponse = {
  invoices: InvoiceResult;
};

type GetRevenueLastThreeMonthsResponse = {
  lastThreeMonthsRevenue: RevenueLastThreeMonthsResult[];
};

type GetInvoiceResponse = {
  getInvoiceById: GetInvoiceResult;
};

@Injectable({
  providedIn: "root",
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  public searchCustomers(text: string = ""): Observable<CustomerResult> {
    return this.apollo
      .query<SearchCustomerResponse>({
        query: SEARCH_CUSTOMERS,
        variables: {
          text,
        },
      })
      .pipe(map((result) => result.data.searchCustomers));
  }

  public getInvoices(): Observable<InvoiceResult> {
    return this.apollo
      .query<GetInvoicesResponse>({
        query: GET_INVOICES,
      })
      .pipe(map((result) => result.data.invoices));
  }

  public getLastThreeMonthsRevenue(): Observable<
    RevenueLastThreeMonthsResult[]
  > {
    return this.apollo
      .query<GetRevenueLastThreeMonthsResponse>({
        query: GET_LAST_THREE_MONTHS_REVENUE,
      })
      .pipe(map((result) => result.data.lastThreeMonthsRevenue));
  }

  public getInvoiceById(id: string): Observable<GetInvoiceResult> {
    return this.apollo
      .query<GetInvoiceResponse>({
        query: GET_INVOICE_BY_ID,
        variables: {
          getInvoiceByIdId: id,
        },
      })
      .pipe(map((result) => result.data.getInvoiceById));
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

  public deleteInvoice(id: string): Observable<any> {
    return this.apollo
      .mutate({
        mutation: DELETE_INVOICE,
        variables: { input: id },
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
