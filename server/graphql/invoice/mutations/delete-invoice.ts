import db from '../../../db/models';
import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator';

export class DeleteInvoiceMutation extends CommonResolver {
  async getData() {
    const transaction = await db.sequelize.transaction();
    try {
      //vyhledáni faktury podle id
      const invoice = await db.Invoice.findByPk(this.args.input, {
        include: [db.InvoiceItem],
        transaction,
      });

      if (!invoice) {
        throw new Error('Faktura nebyla nalezena.');
      }

      // odstranění všech vazebných položek faktury s transakcí
      await Promise.all(
        invoice.invoiceItems.map((item: any) => item.destroy({ transaction })),
      );

      // odstranění faktury
      await invoice.destroy({ transaction });

      await transaction.commit();

      return {
        success: true,
        message: 'Faktura byla úspěšně odstraněna.',
      };
    } catch (error) {
      await transaction.rollback();
      console.error('Chyba při odstraňování faktury:', error);
      throw new Error('Nepodařilo se odstranit fakturu.');
    }
  }

  public static getResolver() {
    const generator = new Generator(DeleteInvoiceMutation, []);
    return generator.getResolver();
  }
}
