export const typeDefs = [
  `#graphql
  type Invoice {
    id: ID!
    description: String
    dateOfIssue: String
    dueDate: String
    variableNumber: Int
    user: User
    customer: Customer
    invoiceItems: [InvoiceItem!]
  }

  type InvoicesResult{
    count: Int!
    rows: [Invoice!]!
  }

  type InvoiceQuery {
    getInvoices(body:GetInvoiceBody): InvoicesResult!
    getRevenueLastThreeMonths: [LastThreeMonthsRevenue]!
    getInvoiceById(id:String): Invoice
  }

  type InvoiceMutation {
    addInvoice(input: AddInvoiceInput!): Invoice
    updateInvoice(input:UpdateInvoiceInput!): Invoice
    deleteInvoice(input: String!): DeleteInvoiceResponse
  }

  type LastThreeMonthsRevenue{
    month: String!
    revenue: Int!
  }

  type DeleteInvoiceResponse{
    success: Boolean!
    message: String!
  }

  input GetInvoiceBody{
    filterText: String
    order: SortOrderInput
    currentPage: Int
    pageSize: Int
  }
  
  input AddInvoiceInput{
    description: String
    dateOfIssue: String
    dueDate: String
    variableNumber: Int
    customer: AddCustomerInput
    invoiceItems: [AddInvoiceItemInput!]
  }

  input GetInvoiceBody{
    filterText: String
    order: SortOrderInput
    currentPage: Int
    pageSize: Int
  }

  input UpdateInvoiceInput{
    id: ID!
    customerId: ID
    description: String!
    dateOfIssue: String!
    dueDate: String!
    variableNumber: Int!
    customer: UpdateCustomerInput!
    invoiceItems: [UpdateInvoiceItemInput!]!
  }
`,
];
