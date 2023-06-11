import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

  constructor(private apollo: Apollo) { }

  public getInvoices(): Observable<any> {
    return this.apollo.query<any>({
      query: gql`
      query Invoices {
        invoices {
          count
          rows {
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
    });
  }
}
