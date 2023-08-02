import db from '../../../db/models';
import { Op } from 'sequelize';
import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator';

export class getRevenueLastThreeMonthsResolver extends CommonResolver {
  async getData() {
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
            userId: this.context.user.userId,
            dateOfIssue: {
              [Op.gte]: month,
              [Op.lt]: nextMonthStartDate,
            },
          },
        });

        const revenue = data.reduce((acc: number, item: IInvoice) => {
          const total = item.invoiceItems.reduce(
            (subtotal: number, item: IInvoiceItem) => {
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
      const theMonthBeforeRevenue =
        await getRevenuesFromInvoicesBySelectedMonth(theMonthBefore);

      return [thisMonthRevenue, lastMonthRevenue, theMonthBeforeRevenue];
    } catch (error) {
      console.error('Chyba při získávání tržeb:', error);
      throw new Error('Nepodařilo se získat tržby za poslední tři měsíce.');
    }
  }

  public static getResolver() {
    const generator = new Generator(getRevenueLastThreeMonthsResolver, []);

    return generator.getResolver();
  }
}
