import db from '../../models';
import { invoiceItems } from '../../seeders/invoice-items';

/**
 * Vytvoření fakturačních položek
 * @returns vytvoří položky faktury ze seeders
 */

export const createInvoiceItems = async () => {
  try {
    await Promise.all(
      invoiceItems.map((item) => {
        db.InvoiceItem.create(item);
      }),
    );
  } catch (error) {
    console.error('Chyba při vytváření položek faktur:', error);
    throw new Error('Nepodařilo se vytvořit položky faktur.');
  }
};

/**
 * Seznam položek faktur
 * @returns vrátí seznam fakturačních položek
 */

export const getInvoiceItems = async (): Promise<InvoiceItemResult> => {
  try {
    const invoiceItemsData = await db.InvoiceItem.findAndCountAll();

    const invoiceItems = await invoiceItemsData.rows.map(
      (item: InvoiceItem) => {
        return {
          id: item.id,
          invoiceId: item.invoiceId,
          name: item.name,
          unitPrice: item.unitPrice,
          numberOfItems: item.numberOfItems,
        };
      },
    );

    return {
      rows: invoiceItems,
      count: invoiceItemsData.count,
    };
  } catch (error) {
    console.error('Chyba při získávání položek faktur:', error);
    throw new Error('Nepodařilo se získat položky faktur.');
  }
};
