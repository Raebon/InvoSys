import db from '../../../db/models';
import { CommonResolver } from '../../../utils/resolvers/base/common';
import { Generator } from '../../../utils/resolvers/generator';

export class GetCustomersResolver extends CommonResolver {
  async getData() {
    try {
      const customerData = await db.Customer.findAndCountAll({
        where: { userId: this.context.user.userId },
      });

      return { count: customerData.count, rows: customerData.rows };
    } catch (error) {
      console.error('Chyba při získávání zákazníku:', error);
      throw new Error('Nepodařilo se získat zákazníky.');
    }
  }

  public static getResolver() {
    const generator = new Generator(GetCustomersResolver, []);

    return generator.getResolver();
  }
}
