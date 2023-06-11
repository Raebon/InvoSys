import { getCustomers, getInvoiceItems, getInvoices, getRevenueLastThreeMonths } from "../utils"
export const resolvers = {
  Query: {
    customers: async () => getCustomers(),
    invoices: async () => getInvoices(),
    invoiceItems: async () => getInvoiceItems(),
    lastThreeMonthsRevenue: async () => getRevenueLastThreeMonths(),
  },
};