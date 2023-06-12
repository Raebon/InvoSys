import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/schema';
import db from '../models';
import { createCustomers, createInvoices, createInvoiceItems, getRevenueLastThreeMonths, getInvoices } from './utils';

/* createCustomers()
createInvoices()
createInvoiceItems() */
//getRevenueLastThreeMonths()
//getInvoices()
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

db.sequelize.sync().then(() => {
  startServer()
});

const startServer = async () => {

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

