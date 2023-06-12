import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

  constructor(private apollo: Apollo) { }

  public getInvoices(): Observable<InvoiceResult> {
    return this.apollo.query<InvoiceResult>({
      query: gql`
      query Invoices {
        invoices {
          count
          rows {
            id
            customer {
              firstName
              lastName
            }
            dateOfIssue
            invoiceItems {
              numberOfItems
              unitPrice
            }
          }
        }
      }
      `
    }).pipe(map((result: { data: any; }) => result.data.invoices));
  }

  public getLastThreeMonthsRevenue(): Observable<RevenueLastThreeMonthsResult[]> {
    return this.apollo.query<RevenueLastThreeMonthsResult[]>({
      query: gql`
      query LastThreeMonthsRevenue {
        lastThreeMonthsRevenue {
          month
          revenue
        }
      }
      `
    }).pipe(map((result: { data: any; }) => result.data.lastThreeMonthsRevenue));
  }
}
