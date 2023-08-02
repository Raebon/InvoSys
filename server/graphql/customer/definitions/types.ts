export const typeDefs = [
  `#graphql
type Customer {
  id: ID!
  firstName: String
  lastName: String
  email: String
}

type CustomerQuery {
  getCustomers: CustomerResult!
  searchCustomers(text:String): CustomerResult!
}

type CustomerResult{
  count: Int!
  rows: [Customer]
}

input AddCustomerInput{
  firstName: String!
  lastName: String!
  email:  String!
}

input UpdateCustomerInput{
  id: ID
  firstName: String!
  lastName: String!
  email: String!
}
`,
];
