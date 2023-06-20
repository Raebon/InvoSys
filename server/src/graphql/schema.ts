export const typeDefs = `#graphql
  type Customer {
    id: ID!
    firstName: String
    lastName: String
    email: String
  }

  type User {
    id: ID!
    firstName: String
    lastName: String
    email: String
  }

  type InvoiceItem {
    id: ID
    invoiceId: ID
    name: String
    unitPrice: Int
    numberOfItems: Int
  }

  type Invoice {
    id: ID!
    description: String!
    dateOfIssue: String!
    user: User
    customer: Customer
    invoiceItems: [InvoiceItem!]
  }

  type InvoicesResult{
    count: Int!
    rows: [Invoice!]!
  }

  type CustomerResult{
    count: Int!
    rows: [Customer]
  }

  type InvoiceItemResult{
    count: Int!
    rows: [InvoiceItem]
  }

  type LastThreeMonthsRevenue{
    month: String!
    revenue: Int!
  }

  type DeleteInvoiceResponse{
    success: Boolean!
    message: String!
  }

  
  type Query{
    customers: CustomerResult!
    invoices(body:GetInvoiceBody): InvoicesResult!
    invoiceItems: InvoiceItemResult!
    lastThreeMonthsRevenue: [LastThreeMonthsRevenue]
    getInvoiceById(id:String!): Invoice
    searchCustomers(text:String): CustomerResult!
  }
  
  type Mutation{
    addInvoice(input: AddInvoiceInput!): Invoice!
    updateInvoice(input: UpdateInvoiceInput!): Invoice!
    deleteInvoice(input: ID!): DeleteInvoiceResponse
  }
  
  input GetInvoiceBody{
    currentPage: Int
    pageSize: Int
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
