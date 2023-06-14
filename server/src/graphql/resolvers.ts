import {
  getCustomers,
  getInvoiceItems,
  getInvoices,
  getRevenueLastThreeMonths,
  getInvoiceById,
  addInvoice,
  updateInvoice,
} from '../utils';
export const resolvers = {
  Query: {
    customers: async () => getCustomers(),
    invoices: async () => getInvoices(),
    invoiceItems: async () => getInvoiceItems(),
    lastThreeMonthsRevenue: async () => getRevenueLastThreeMonths(),
    getInvoiceById: async (_: any, args: any) => getInvoiceById(args.id),
  },
  Mutation: {
    addInvoice: async (_: any, { input }: { input: AddInvoiceInput }) =>
      addInvoice(input),
    updateInvoice: async (_: any, { input }: { input: UpdateInvoiceInput }) =>
      updateInvoice(input),
  },
};
