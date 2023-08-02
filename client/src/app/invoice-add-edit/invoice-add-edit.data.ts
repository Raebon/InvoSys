import { gql } from "apollo-angular";

export const GET_INVOICE_BY_ID = gql`
  query GetInvoiceById($getInvoiceByIdId: String) {
    invoice {
      getInvoiceById(id: $getInvoiceByIdId) {
        id
        customer {
          email
          id
          firstName
          lastName
        }
        dateOfIssue
        dueDate
        description
        variableNumber
        invoiceItems {
          id
          name
          numberOfItems
          unitPrice
        }
      }
    }
  }
`;

export const CREATE_INVOICE = gql`
  mutation Invoice($input: AddInvoiceInput!) {
    invoice {
      addInvoice(input: $input) {
        id
        description
        dateOfIssue
        dueDate
        variableNumber
        customer {
          id
          firstName
          lastName
          email
        }
        invoiceItems {
          id
          invoiceId
          name
          unitPrice
          numberOfItems
        }
      }
    }
  }
`;

export const UPDATE_INVOICE = gql`
  mutation UpdateInvoice($input: UpdateInvoiceInput!) {
    invoice {
      updateInvoice(input: $input) {
        customer {
          id
        }
        dateOfIssue
        dueDate
        description
        id
        invoiceItems {
          id
          invoiceId
        }
      }
    }
  }
`;
