export const typeDefs = `#graphql
  type Customer {
    id: String
    firstName: String
    lastName: String
    email: String
  }

  type IvoiceItem {
    id: String
    invoiceId: String
    name: String
    unitPrice: Int
    numberOfItems: Int
  }

  type Invoice {
    id: String!
    customerId: String!
    description: String!
    dateOfIssue: String!
    customer: Customer!
    invoiceItems: [IvoiceItem!]!
  }

  type InvoicesResult{
    count: Int!
    rows: [Invoice!]!
  }

  type Query{
    customers: [Customer]
    invoices: InvoicesResult!
    invoiceItems: [IvoiceItem]
  }
`;