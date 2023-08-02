export const typeDefs = [
  `#graphql
  type InvoiceItem {
    id: ID
    invoiceId: ID
    name: String
    unitPrice: Int
    numberOfItems: Int
  }

  type InvoiceItemResult{
    count: Int!
    rows: [InvoiceItem]
  }

  type InvoiceItemsQuery {
    getInvoiceItems: InvoiceItemResult!
  }

  type InvoiceItemResult{
    count: Int!
    rows: [InvoiceItem]
  }

  input AddInvoiceItemInput{
    name: String!
    unitPrice: Int!
    numberOfItems:Int!
  }

  input UpdateInvoiceItemInput{
    id: ID
    name: String!
    unitPrice: Int!
    numberOfItems: Int!
  }
  
  input SortOrderInput {
    field: String!
    direction: String!
  }
`,
];
