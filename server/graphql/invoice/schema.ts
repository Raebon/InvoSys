import { typeDefs } from './definitions/types';
import { AddInvoiceMutation } from './mutations/add-invoice';
import { DeleteInvoiceMutation } from './mutations/delete-invoice';
import { UpdateInvoiceMutation } from './mutations/update-invoice';
import { GetInvoiceById } from './queries/get-invoice-by-id';
import { GetInvoices } from './queries/get-invoices';
import { getRevenueLastThreeMonthsResolver } from './queries/get-revenue-last-three-months';

export class InvoiceSchema {
  static typeDefs = typeDefs;

  static getResolvers() {
    return {
      InvoiceQuery: {
        getInvoices: GetInvoices.getResolver(),
        getInvoiceById: GetInvoiceById.getResolver(),
        getRevenueLastThreeMonths:
          getRevenueLastThreeMonthsResolver.getResolver(),
      },
      InvoiceMutation: {
        addInvoice: AddInvoiceMutation.getResolver(),
        updateInvoice: UpdateInvoiceMutation.getResolver(),
        deleteInvoice: DeleteInvoiceMutation.getResolver(),
      },
      Query: {
        invoice: () => {
          return {};
        },
      },
      Mutation: {
        invoice: () => {
          return {};
        },
      },
    };
  }
}
