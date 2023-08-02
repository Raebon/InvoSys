import db from '../../../db/models';
import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator';

export class GetInvoiceItemsResolver extends CommonResolver {
  async getData() {
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
  }

  public static getResolver() {
    const generator = new Generator(GetInvoiceItemsResolver, []);

    return generator.getResolver();
  }
}
