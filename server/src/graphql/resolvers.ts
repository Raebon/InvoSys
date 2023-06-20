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
    customers: async (_: any, args: any, contextValue: ContextValueI) =>
      getCustomers(contextValue.user),

    invoices: async (
      _: any,
      { body }: { body: GetInvoicesBody },
      contextValue: ContextValueI,
    ) => getInvoices(body, contextValue.user),

    invoiceItems: async () => getInvoiceItems(),

    lastThreeMonthsRevenue: async (
      _: any,
      args: any,
      contextValue: ContextValueI,
    ) => getRevenueLastThreeMonths(contextValue.user),

    getInvoiceById: async (
      _: any,
      args: { id: string },
      contextValue: ContextValueI,
    ) => getInvoiceById(args.id),

    searchCustomers: async (
      _: any,
      args: { text: string },
      contextValue: ContextValueI,
    ) => searchCustomers(args.text, contextValue.user),
  },
  Mutation: {
    addInvoice: async (
      _: any,
      { input }: { input: AddInvoiceInput },
      contextValue: ContextValueI,
    ) => addInvoice(input, contextValue.user),

    updateInvoice: async (_: any, { input }: { input: UpdateInvoiceInput }) =>
      updateInvoice(input),

    deleteInvoice: async (_: any, { input }: { input: string }) => {
      deleteInvoice(input);
    },
  },
};
