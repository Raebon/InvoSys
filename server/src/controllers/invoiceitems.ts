import db from '../../db/models';

/**
 * Seznam položek faktur
 * @returns vrátí seznam fakturačních položek
 */

export const getInvoiceItems = async (): Promise<InvoiceItemResult> => {
  try {
    const invoiceItemsData = await db.InvoiceItem.findAndCountAll();
    return {
      rows: invoiceItemsData.rows,
      count: invoiceItemsData.count,
    };
  } catch (error) {
    console.error('Chyba při získávání položek faktur:', error);
    throw new Error('Nepodařilo se získat položky faktur.');
  }
};
