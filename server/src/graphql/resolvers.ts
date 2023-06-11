import { getCustomers, getInvoiceItems, getInvoices } from "../utils"
export const resolvers = {
  Query: {
    customers: async () => getCustomers(),
    invoices: async () => getInvoices(),
    invoiceItems: async () => getInvoiceItems(),
  },
};