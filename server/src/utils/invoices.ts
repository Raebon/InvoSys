import db from '../../models';
import { invoices } from "../../seeders/invoices"

export const createInvoices = () => {
  console.log("create invoices")
  invoices.map(invoice => {
    db.Invoice.create(invoice)
  })
}

export const getInvoices = async (): Promise<InvoiceResult> => {
  const invoiceData = await db.Invoice.findAndCountAll({
    include: [db.Customer, db.InvoiceItem]
  })
  const invoices = await invoiceData.rows.map((invoice: Invoice) => {
    return {
        id: invoice.id,
        customerId: invoice.customerId,
        description: invoice.description,
        dateOfIssue: invoice.dateOfIssue,
        customer: invoice.Customer,
        invoiceItems: invoice.InvoiceItems    
    }
  })

  return {
  count:invoiceData.count,
  rows: invoices
  }
}