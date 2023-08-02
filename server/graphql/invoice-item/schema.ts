import { typeDefs } from './definitions/types';
import { GetInvoiceItemsResolver } from './queries/get-invoice-items';

export class InvoiceItemsSchema {
  static typeDefs = typeDefs;

  static getResolvers() {
    return {
      InvoiceItemsQuery: {
        getInvoiceItems: GetInvoiceItemsResolver.getResolver(),
      },
      Query: {
        invoiceItems: () => {
          return {};
        },
      },
    };
  }
}
