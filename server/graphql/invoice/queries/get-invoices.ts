import { Op } from 'sequelize';
import db from '../../../db/models';
import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator';
import { generateOrderBy } from '../../../utils/generateOrderBy';

export class GetInvoices extends CommonResolver {
  async getData() {
    try {
      const { currentPage, pageSize, order, filterText } = this.args;

      let orderBy:
        | [string, 'ASC' | 'DESC']
        | [any, string, 'ASC' | 'DESC']
        | undefined = order ? [order?.field, order?.direction] : undefined;

      const offset =
        currentPage && pageSize ? (currentPage - 1) * pageSize : undefined;
      const limit = pageSize;

      const filterTextInput = filterText ?? '';

      const searchTokens = filterTextInput
        .split(' ')
        .filter((token: string) => token.length > 0);

      const whereConditions = searchTokens.map((token: string) => ({
        [Op.or]: [
          { '$customer.firstName$': { [Op.iLike]: `%${token}%` } },
          { '$customer.lastName$': { [Op.iLike]: `%${token}%` } },
          { '$Invoice.variableNumber$': parseInt(token) },
        ],
      }));

      if (order && order['field'] === 'totalPrice') {
        let totalPriceSorting: any | undefined;
        let invoiceLiteral = db.sequelize.literal(
          '(SELECT SUM("InvoiceItems"."numberOfItems" * "InvoiceItems"."unitPrice") FROM "InvoiceItems" WHERE "InvoiceItems"."invoiceId" = "Invoice"."id")',
        );
        totalPriceSorting = [invoiceLiteral, order.direction];

        orderBy = totalPriceSorting;
      }

      if (order && order['field'] === 'CustomerFirstName') {
        orderBy = generateOrderBy('customer', 'firstName', order.direction);
      }

      if (order && order['field'] === 'CustomerLastName') {
        orderBy = generateOrderBy('customer', 'lastName', order.direction);
      }

      const invoiceData = await db.Invoice.findAndCountAll({
        distinct: true,
        where: {
          userId: this.context.user.userId,
        },
        include: [
          {
            model: db.Customer,
            as: 'customer',
            where: {
              [Op.and]: whereConditions,
            },
          },
          db.InvoiceItem,
          db.User,
        ],
        order: order ? [orderBy] : undefined,
        offset,
        limit,
      });

      const invoices = invoiceData.rows.map((invoice: IInvoice) => {
        return {
          id: invoice.id,
          customerId: invoice.customerId,
          description: invoice.description,
          dateOfIssue: invoice.dateOfIssue,
          dueDate: invoice.dueDate,
          variableNumber: invoice.variableNumber,
          customer: invoice.customer,
          user: invoice.user,
          invoiceItems: invoice.invoiceItems,
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
  }

  public static getResolver() {
    const generator = new Generator(GetInvoices, []);

    return generator.getResolver();
  }
}
