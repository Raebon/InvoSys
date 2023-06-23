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
} from '../controllers';

export const resolvers = {
  Query: {
    customers: async (_: any, args: any, contextValue: IContextValue) =>
      getCustomers(contextValue.user),

    invoices: async (
      _: any,
      { body }: { body: IGetInvoicesBody },
      contextValue: IContextValue,
    ) => getInvoices(body, contextValue.user),

    invoiceItems: async () => getInvoiceItems(),

    lastThreeMonthsRevenue: async (
      _: any,
      args: any,
      contextValue: IContextValue,
    ) => getRevenueLastThreeMonths(contextValue.user),

    getInvoiceById: async (
      _: any,
      args: { id: string },
      contextValue: IContextValue,
    ) => getInvoiceById(args.id),

    searchCustomers: async (
      _: any,
      args: { text: string },
      contextValue: IContextValue,
    ) => searchCustomers(args.text, contextValue.user),
  },
  Mutation: {
    addInvoice: async (
      _: any,
      { input }: { input: TCreateInvoiceInput },
      contextValue: IContextValue,
    ) => addInvoice(input, contextValue.user),

    updateInvoice: async (_: any, { input }: { input: IUpdateInvoiceInput }) =>
      updateInvoice(input),

    deleteInvoice: async (_: any, { input }: { input: string }) => {
      deleteInvoice(input);
    },
  },
};
