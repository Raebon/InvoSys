import db from '../../models';
import { invoiceItems } from "../../seeders/invoice-items"

export const createInvoiceItems = () => {
  console.log("create invoice items")
  invoiceItems.map(item => {
    db.InvoiceItem.create(item)
  })
}

export const getInvoiceItems = async (): Promise<InvoiceItem[]> => {
  const invoiceItemsData = await db.InvoiceItem.findAll()

  const invoiceItems = await invoiceItemsData.map((item: InvoiceItem) => {
    return {
      id: item.id,
      invoiceId: item.invoiceId,
      name: item.name,
      unitPrice: item.unitPrice,
      numberOfItems: item.numberOfItems,
    }
  })

  return invoiceItems
}