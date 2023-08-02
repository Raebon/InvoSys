import { Op } from 'sequelize';
import db from '../../../db/models';
import { BaseResolver } from '../../../utils/resolvers/base';
import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator/generator';

export class SearchCustomersResolver extends CommonResolver {
  async getData() {
    try {
      if (this.args.text.trim().length < 2) {
        return { count: 0, rows: [] };
      }

      const searchTokens = this.args.text
        .split(' ')
        .filter((token: string) => token.length > 0);

      const whereConditions = searchTokens.map((token: string) => ({
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${token}%` } },
          { lastName: { [Op.iLike]: `%${token}%` } },
          { email: { [Op.iLike]: `%${token}%` } },
        ],
      }));

      const customerData = await db.Customer.findAndCountAll({
        where: {
          userId: this.context.user.userId,
          [Op.and]: whereConditions,
        },
      });
      return { count: customerData.count, rows: customerData.rows };
    } catch (error) {
      console.error('Chyba při vyhledávání zákazníků:', error);
      throw new Error('Nepodařilo se vyhledat zákazníky.');
    }
  }

  public static getResolver() {
    const generator = new Generator(SearchCustomersResolver, []);
    return generator.getResolver();
  }
}
