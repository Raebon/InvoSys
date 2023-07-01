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
  searchCustomers: ICustomerResult;
};

type GetInvoicesResponse = {
  invoices: IInvoiceResult;
};

type GetRevenueLastThreeMonthsResponse = {
  lastThreeMonthsRevenue: RevenueLastThreeMonthsResult[];
};

type GetInvoiceResponse = {
  getInvoiceById: IInvoice;
};

@Injectable({
  providedIn: "root",
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  public searchCustomers(text: string = ""): Observable<ICustomerResult> {
    return this.apollo
      .query<SearchCustomerResponse>({
        query: SEARCH_CUSTOMERS,
        variables: {
          text,
        },
      })
      .pipe(map((result) => result.data.searchCustomers));
  }

  public getInvoices(params?: IGetInvoicesBody): Observable<IInvoiceResult> {
    return this.apollo
      .query<GetInvoicesResponse>({
        query: GET_INVOICES,
        variables: { body: params },
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

  public getInvoiceById(id: string): Observable<IInvoice> {
    return this.apollo
      .query<GetInvoiceResponse>({
        query: GET_INVOICE_BY_ID,
        variables: {
          getInvoiceByIdId: id,
        },
      })
      .pipe(map((result) => result.data.getInvoiceById));
  }

  public createInvoice(invoiceInput: IInvoiceInput): Observable<any> {
    const { inputCustomer, inputInvoiceItems, ...rest } = invoiceInput;
    const payload = {
      ...rest,
      customer: inputCustomer,
      invoiceItems: inputInvoiceItems,
    };
    return this.apollo
      .mutate({
        mutation: CREATE_INVOICE,
        variables: { input: payload },
      })
      .pipe(
        map((res) => {
          this.invalidateCache();
          return res.data;
        })
      );
  }

  public updateInvoice(invoiceInput: IInvoiceInput): Observable<any> {
    const { inputCustomer, inputInvoiceItems, variableNumber, ...rest } =
      invoiceInput;
    const payload = {
      ...rest,
      variableNumber: Number(variableNumber),
      customer: inputCustomer,
      invoiceItems: inputInvoiceItems,
    };
    return this.apollo
      .mutate({
        mutation: UPDATE_INVOICE,
        variables: { input: payload },
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
