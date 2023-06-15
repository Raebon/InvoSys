import { gql } from "apollo-angular";

const GET_INVOICES = gql`
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
`;

const GET_LAST_THREE_MONTHS_REVENUE = gql`
  query LastThreeMonthsRevenue {
    lastThreeMonthsRevenue {
      month
      revenue
    }
  }
`;

const GET_INVOICE_BY_ID = gql`
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
`;

export { GET_INVOICES, GET_LAST_THREE_MONTHS_REVENUE, GET_INVOICE_BY_ID };
