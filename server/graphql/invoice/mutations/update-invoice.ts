import { v4 as uuidv4 } from 'uuid';
import db from '../../../db/models';
import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator';

export class UpdateInvoiceMutation extends CommonResolver {
  async getData() {
    const { input } = this.args;
    const transaction = await db.sequelize.transaction();
    try {
      // vytáhnout aktuální data zákazníka z DB podle emailu
      let customer = await db.Customer.findOne({
        where: { email: input.customer.email },
        transaction,
      });

      if (!customer) {
        // záznam neexistuje => vytvořit
        await db.Customer.create({
          firstName: input.customer.firstName,
          lastName: input.customer.lastName,
          email: input.customer.email,
          transaction,
        });
      } else {
        // záznam existuje => update
        await db.Customer.update(
          {
            firstName: input.customer.firstName,
            lastName: input.customer.lastName,
            email: input.customer.email,
          },
          { where: { id: customer.id }, transaction },
        );
      }

      // update faktury
      const invoice = await db.Invoice.update(
        {
          customerId: customer.id,
          description: input.description,
          dateOfIssue: input.dateOfIssue,
          dueDate: input.dueDate,
          variableNumber: input.variableNumber,
        },
        {
          where: { id: input.id },
          transaction,
        },
      );

      // update záznamů položek faktury, pokud není ID položky založit nový
      await db.InvoiceItem.destroy({
        where: { invoiceId: input.id },
        transaction,
      });

      const invoiceItems = input.invoiceItems.map((item: any) => ({
        id: item.id || uuidv4(),
        invoiceId: input.id,
        name: item.name,
        unitPrice: item.unitPrice,
        numberOfItems: item.numberOfItems,
      }));

      await db.InvoiceItem.bulkCreate(invoiceItems, { transaction });

      await transaction.commit();

      // vrátit upravenou fakturu
      const updatedInvoice: IInvoice = await db.Invoice.findByPk(input.id, {
        include: [db.Customer, db.InvoiceItem],
      });

      if (!invoice) {
        throw new Error('Faktura nebyla nalezena');
      }

      return {
        id: updatedInvoice.id,
        userId: updatedInvoice.userId,
        customerId: updatedInvoice.customerId,
        description: updatedInvoice.description,
        dateOfIssue: updatedInvoice.dateOfIssue,
        dueDate: updatedInvoice.dueDate,
        variableNumber: updatedInvoice.variableNumber,
        customer: updatedInvoice.customer,
        invoiceItems: updatedInvoice.invoiceItems,
      };
    } catch (error) {
      await transaction.rollback();
      console.error('updateInvoice - chyba při aktualizaci faktury', error);
      throw new Error('Při aktualizaci faktury došlo k chybě!');
    }
  }

  public static getResolver() {
    const generator = new Generator(UpdateInvoiceMutation, []);
    return generator.getResolver();
  }
}
