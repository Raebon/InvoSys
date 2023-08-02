import db from '../../../db/models';
import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator';

export class AddInvoiceMutation extends CommonResolver {
  async getData() {
    const { input } = this.args;
    const transaction = await db.sequelize.transaction();
    try {
      //vytvoření položek faktury
      const invoiceItems: Omit<IInvoiceItem, 'id'>[] = input.invoiceItems.map(
        (item: any) => ({
          invoiceId: invoice.id,
          name: item.name,
          unitPrice: item.unitPrice,
          numberOfItems: item.numberOfItems,
        }),
      );

      //zjištění, jestli zákazník neexistuje v DB
      let customer = await db.Customer.findOne({
        where: {
          email: input.customer.email,
          userId: this.context.user.userId,
        },
        transaction,
      });

      //vytvoření zákazníka
      if (!customer) {
        customer = await db.Customer.create({
          userId: this.context.user.userId,
          firstName: input.customer.firstName,
          lastName: input.customer.lastName,
          email: input.customer.email,
          transaction,
        });
      }

      //vytvoření faktury
      const invoice: IInvoice = await db.Invoice.create({
        userId: this.context.user.userId,
        customerId: customer.id,
        description: input.description,
        dateOfIssue: input.dateOfIssue,
        dueDate: input.dueDate,
        variableNumber: input.variableNumber,
        transaction,
      });

      await db.InvoiceItem.bulkCreate(invoiceItems, { transaction });

      await transaction.commit();

      return {
        id: invoice.id,
        customerId: customer.id,
        description: invoice.description,
        dateOfIssue: invoice.dateOfIssue,
        dueDate: invoice.dueDate,
        variableNumber: invoice.variableNumber,
        customer: customer,
        invoiceItems: invoiceItems,
      };
    } catch (error) {
      await transaction.rollback();
      console.error('addInvoice - chyba při založení faktury', error);
      throw new Error('Při založení faktury došlo k chybě!');
    }
  }

  public static getResolver() {
    const generator = new Generator(AddInvoiceMutation, []);
    return generator.getResolver();
  }
}
