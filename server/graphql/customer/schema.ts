import { typeDefs } from './definitions/types';
import { SearchCustomersResolver } from './queries/search-customers';
import { GetCustomersResolver } from './queries/get-customers';

export class CustomersSchema {
  static typeDefs = typeDefs;

  static getResolvers() {
    return {
      CustomerQuery: {
        getCustomers: GetCustomersResolver.getResolver(),
        searchCustomers: SearchCustomersResolver.getResolver(),
      },
      Query: {
        customer: () => {
          return {};
        },
      },
    };
  }
}
