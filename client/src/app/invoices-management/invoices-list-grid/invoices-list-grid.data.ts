import { gql } from "apollo-angular";

export const GET_INVOICES = gql`
  query GetInvoices($body: GetInvoiceBody) {
    invoice {
      getInvoices(body: $body) {
        count
        rows {
          dateOfIssue
          dueDate
          description
          variableNumber
          id
          customer {
            firstName
            lastName
            id
          }
          user {
            firstName
            lastName
            id
          }
          invoiceItems {
            name
            numberOfItems
            unitPrice
          }
        }
      }
    }
  }
`;
