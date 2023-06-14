import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  public getInvoices(): Observable<InvoiceResult> {
    return this.apollo
      .query<InvoiceResult>({
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
        `,
      })
      .pipe(map((result: { data: any }) => result.data.invoices));
  }

  public getLastThreeMonthsRevenue(): Observable<
    RevenueLastThreeMonthsResult[]
  > {
    return this.apollo
      .query<RevenueLastThreeMonthsResult[]>({
        query: gql`
          query LastThreeMonthsRevenue {
            lastThreeMonthsRevenue {
              month
              revenue
            }
          }
        `,
      })
      .pipe(map((result: { data: any }) => result.data.lastThreeMonthsRevenue));
  }

  public getInvoiceById(id: string): Observable<GetInvoiceResult> {
    return this.apollo
      .query<GetInvoiceResult>({
        query: gql`
          query GetInvoiceById($getInvoiceByIdId: String!) {
            getInvoiceById(id: $getInvoiceByIdId) {
              id
              customer {
                email
                id
                firstName
                lastName
              }
              dateOfIssue
              description
              invoiceItems {
                id
                name
                numberOfItems
                unitPrice
              }
            }
          }
        `,
        variables: {
          getInvoiceByIdId: id,
        },
      })
      .pipe(map((result: { data: any }) => result.data.getInvoiceById));
  }

  public createInvoice(invoiceInput: AddInvoiceInput): Observable<any> {
    const createInvoiceMutation = gql`
      mutation AddInvoice($input: AddInvoiceInput!) {
        addInvoice(input: $input) {
          id
          customerId
          dateOfIssue
          description
          customer {
            email
            firstName
            id
            lastName
          }
          invoiceItems {
            id
            invoiceId
            name
            numberOfItems
            unitPrice
          }
        }
      }
    `;

    return this.apollo
      .mutate({
        mutation: createInvoiceMutation,
        variables: { input: invoiceInput },
      })
      .pipe(map((res) => res.data));
  }
}
