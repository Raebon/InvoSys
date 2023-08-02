import db from '../../../db/models';
import { Op } from 'sequelize';
import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator';

export class GetInvoiceById extends CommonResolver {
  async getData() {
    try {
      const invoice: Omit<IInvoice, 'customerId'> = await db.Invoice.findByPk(
        this.args.id,
        {
          include: [db.Customer, db.InvoiceItem, db.User],
        },
      );

      if (!invoice) {
        throw new Error(`Faktura s ID ${this.args.id} nebyla nalezena.`);
      }

      return {
        id: invoice.id,
        description: invoice.description,
        dateOfIssue: invoice.dateOfIssue,
        dueDate: invoice.dueDate,
        user: invoice.user,
        customer: invoice.customer,
        invoiceItems: invoice.invoiceItems,
        variableNumber: invoice.variableNumber,
      };
    } catch (error) {
      console.error(`Chyba při získávání faktury s ID ${this.args.id}:`, error);
      throw new Error(`Nepodařilo se získat fakturu s ID ${this.args.id}.`);
    }
  }

  public static getResolver() {
    const generator = new Generator(GetInvoiceById, []);

    return generator.getResolver();
  }
}
