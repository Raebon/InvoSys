import {
  getCustomers,
  getInvoiceItems,
  getInvoices,
  getRevenueLastThreeMonths,
  getInvoiceById,
  addInvoice,
  updateInvoice,
  searchCustomers,
  deleteInvoice,
} from '../utils';
export const resolvers = {
  Query: {
    customers: async () => getCustomers(),
    invoices: async () => getInvoices(),
    invoiceItems: async () => getInvoiceItems(),
    lastThreeMonthsRevenue: async () => getRevenueLastThreeMonths(),
    getInvoiceById: async (_: any, args: { id: string }) =>
      getInvoiceById(args.id),
    searchCustomers: async (_: any, args: { text: string }) =>
      searchCustomers(args.text),
  },
  Mutation: {
    addInvoice: async (_: any, { input }: { input: AddInvoiceInput }) =>
      addInvoice(input),
    updateInvoice: async (_: any, { input }: { input: UpdateInvoiceInput }) =>
      updateInvoice(input),
    deleteInvoice: async (_: any, { input }: { input: string }) => {
      deleteInvoice(input);
    },
  },
};
