import { Op } from 'sequelize';
import db from '../../models';
import { invoices } from '../../seeders/invoices';

export const createInvoices = async () => {
  try {
    await Promise.all(
      invoices.map((invoice) => {
        return db.Invoice.create(invoice);
      }),
    );
  } catch (error) {
    console.error('Chyba při vytváření faktur:', error);
    throw new Error('Nepodařilo se vytvořit faktury.');
  }
};

export const getInvoices = async (): Promise<InvoiceResult> => {
  try {
    const invoiceData = await db.Invoice.findAndCountAll({
      include: [db.Customer, db.InvoiceItem],
    });

    const invoices = invoiceData.rows.map((invoice: Invoice) => {
      return {
        id: invoice.id,
        customerId: invoice.customerId,
        description: invoice.description,
        dateOfIssue: invoice.dateOfIssue,
        customer: invoice.Customer,
        invoiceItems: invoice.InvoiceItems,
      };
    });

    return {
      count: invoiceData.count,
      rows: invoices,
    };
  } catch (error) {
    console.error('Chyba při získávání faktur:', error);
    throw new Error('Nepodařilo se získat faktury.');
  }
};

export const getRevenueLastThreeMonths = async (): Promise<
  RevenueLastThreeMonthsResult[]
> => {
  try {
    const translatedMonths: string[] = [
      'Leden',
      'Únor',
      'Březen',
      'Duben',
      'Květen',
      'Červen',
      'Červenec',
      'Srpen',
      'Září',
      'Říjen',
      'Listopad',
      'Prosinec',
    ];
    const startDate: Date = new Date();
    const thisMonth: Date = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      1,
      23,
      59,
    );
    const lastMonth: Date = new Date(
      startDate.getFullYear(),
      startDate.getMonth() - 1,
      1,
      23,
      59,
    );
    const theMonthBefore: Date = new Date(
      startDate.getFullYear(),
      startDate.getMonth() - 2,
      1,
      23,
      59,
    );

    const getRevenuesFromInvoicesBySelectedMonth = async (
      month: Date,
    ): Promise<any> => {
      const nextMonthStartDate = new Date(
        month.getFullYear(),
        month.getMonth() + 1,
        1,
        0,
        0,
        0,
      );

      const data = await db.Invoice.findAll({
        include: [db.InvoiceItem],
        where: {
          dateOfIssue: {
            [Op.gte]: month,
            [Op.lt]: nextMonthStartDate,
          },
        },
      });

      const revenue = data.reduce((acc: number, item: Invoice) => {
        const total = item.InvoiceItems.reduce(
          (subtotal: number, item: InvoiceItem) => {
            return subtotal + item.unitPrice * item.numberOfItems;
          },
          0,
        );
        return acc + total;
      }, 0);

      return {
        month: translatedMonths[month.getMonth()],
        revenue,
      };
    };

    const thisMonthRevenue = await getRevenuesFromInvoicesBySelectedMonth(
      thisMonth,
    );
    const lastMonthRevenue = await getRevenuesFromInvoicesBySelectedMonth(
      lastMonth,
    );
    const theMonthBeforeRevenue = await getRevenuesFromInvoicesBySelectedMonth(
      theMonthBefore,
    );

    console.log('Celkové tržby', [
      thisMonthRevenue,
      lastMonthRevenue,
      theMonthBeforeRevenue,
    ]);

    return [thisMonthRevenue, lastMonthRevenue, theMonthBeforeRevenue];
  } catch (error) {
    console.error('Chyba při získávání tržeb:', error);
    throw new Error('Nepodařilo se získat tržby za poslední tři měsíce.');
  }
};

export const getInvoiceById = async (
  id: string,
): Promise<GetInvoiceResult | null> => {
  try {
    console.log(id);
    const invoice = await db.Invoice.findByPk(id, {
      include: [db.Customer, db.InvoiceItem],
    });

    if (!invoice) {
      throw new Error(`Faktura s ID ${id} nebyla nalezena.`);
    }

    return {
      id: invoice.id,
      customerId: invoice.customerId,
      description: invoice.description,
      dateOfIssue: invoice.dateOfIssue,
      customer: invoice.Customer,
      invoiceItems: invoice.InvoiceItems,
    };
  } catch (error) {
    console.error(`Chyba při získávání faktury s ID ${id}:`, error);
    throw new Error(`Nepodařilo se získat fakturu s ID ${id}.`);
  }
};
