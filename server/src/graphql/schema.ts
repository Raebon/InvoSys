export const typeDefs = `#graphql
  type Customer {
    id: ID!
    firstName: String
    lastName: String
    email: String
  }

  type InvoiceItem {
    id: ID!
    invoiceId: ID!
    name: String
    unitPrice: Int
    numberOfItems: Int
  }

  type Invoice {
    id: ID!
    customerId: ID!
    description: String!
    dateOfIssue: String!
    customer: Customer!
    invoiceItems: [InvoiceItem!]!
  }

  type InvoicesResult{
    count: Int!
    rows: [Invoice!]!
  }

  type LastThreeMonthsRevenue{
    month: String!
    revenue: Int!
  }

  type Query{
    customers: [Customer]
    invoices: InvoicesResult!
    invoiceItems: [InvoiceItem]
    lastThreeMonthsRevenue: [LastThreeMonthsRevenue]
    getInvoiceById(id:String!): Invoice
  }

  type Mutation{
    addInvoice(input: AddInvoiceInput!): Invoice!
    updateInvoice(input: UpdateInvoiceInput!): Invoice!
  }

  input AddInvoiceInput{
    description: String!
    dateOfIssue: String!
    customer: AddCustomerInput!
    invoiceItems: [AddInvoiceItemInput!]!
  }

  input AddCustomerInput{
    firstName: String!
    lastName: String!
    email:  String!
  }

  input AddInvoiceItemInput{
    name: String!
    unitPrice: Int!
    numberOfItems:Int!
  }

  input UpdateInvoiceInput{
    id: ID!
    customerId: ID
    description: String!
    dateOfIssue: String!
    customer: UpdateCustomerInput!
    invoiceItems: [UpdateInvoiceItemInput!]!
  }

  input UpdateCustomerInput{
    id: ID
    firstName: String!
    lastName: String!
    email: String!
  }

  input UpdateInvoiceItemInput{
    id: ID
    name: String!
    unitPrice: Int!
    numberOfItems: Int!
  }
`;
