import { gql } from "apollo-angular";

const CREATE_INVOICE = gql`
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

const UPDATE_INVOICE = gql`
  mutation UpdateInvoice($input: UpdateInvoiceInput!) {
    updateInvoice(input: $input) {
      customer {
        id
      }
      customerId
      dateOfIssue
      description
      id
      invoiceItems {
        id
        invoiceId
      }
    }
  }
`;

const DELETE_INVOICE = gql`
  mutation DeleteInvoice($input: ID!) {
    deleteInvoice(input: $input) {
      message
      success
    }
  }
`;

export { CREATE_INVOICE, UPDATE_INVOICE, DELETE_INVOICE };
