const { merge } = require('lodash');
import { makeExecutableSchema } from '@graphql-tools/schema';

import { CustomersSchema } from './customer/schema';
import { InvoiceItemsSchema } from './invoice-item/schema';
import { InvoiceSchema } from './invoice/schema';
import { UserSchema } from './user/schema';

const typeDefs = [
  `#graphql
  type Query{
    customer: CustomerQuery
    invoiceItems: InvoiceItemsQuery
    invoice: InvoiceQuery
  }
  type Mutation {
    invoice: InvoiceMutation
  }
  `,
  ...CustomersSchema.typeDefs,
  ...InvoiceItemsSchema.typeDefs,
  ...InvoiceSchema.typeDefs,
  ...UserSchema.typeDefs,
];

const customerResolvers = CustomersSchema.getResolvers();
const invoiceItemsResolvers = InvoiceItemsSchema.getResolvers();
const invoiceResolvers = InvoiceSchema.getResolvers();
const userResolvers = UserSchema.getResolvers();

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: merge(customerResolvers, invoiceItemsResolvers, invoiceResolvers),
});
