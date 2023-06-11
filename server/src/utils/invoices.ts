import { Op } from 'sequelize';
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
    count: invoiceData.count,
    rows: invoices
  }
}

export const getRevenueLastThreeMonths = async (): Promise<RevenueLastThreeMonthsResult[]> => {
  const translatedMonths: string[] = [
    "Leden",
    "Únor",
    "Březen",
    "Duben",
    "Květen",
    "Červen",
    "Červenec",
    "Srpen",
    "Září",
    "Říjen",
    "Listopad",
    "Prosinec"
  ];
  const startDate: Date = new Date()
  const thisMonth: Date = new Date(startDate.getFullYear(), startDate.getMonth(), 1, 23, 59);
  const lastMonth: Date = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1, 23, 59);
  const theMonthBefore: Date = new Date(startDate.getFullYear(), startDate.getMonth() - 2, 1, 23, 59);

  const getRevenuesFromInvoicesBySelectedMonth = async (month: Date): Promise<any> => {
    const nextMonthStartDate = new Date(month.getFullYear(), month.getMonth() + 1, 1, 0, 0, 0)

    const data = await db.Invoice.findAll({
      include: [db.InvoiceItem],
      where: {
        dateOfIssue: {
          [Op.gte]: month,
          [Op.lt]: nextMonthStartDate
        }
      }
    })

    const revenue = await data.reduce((acc: number, item: Invoice) => {
      const total = item.InvoiceItems.reduce((subtotal: number, item: InvoiceItem) => {
        return subtotal + (item.unitPrice * item.numberOfItems)
      }, 0)
      return acc + total
    }, 0)

    return {
      month: translatedMonths[month.getMonth()],
      revenue
    }
  }

  const thisMonthRevenue = await getRevenuesFromInvoicesBySelectedMonth(thisMonth)
  const lastMonthRevenue = await getRevenuesFromInvoicesBySelectedMonth(lastMonth)
  const theMonthBeforeRevenue = await getRevenuesFromInvoicesBySelectedMonth(theMonthBefore)


  console.log("Celkové tržby", [thisMonthRevenue, lastMonthRevenue, theMonthBeforeRevenue])
  return [thisMonthRevenue, lastMonthRevenue, theMonthBeforeRevenue]
}
