import { Op } from 'sequelize';
import db from '../../../db/models';
import { ICustomer, ISearchCustomersInput } from '../../../interfaces/customer';
import { IListResponse } from '../../../interfaces/response';

export class CustomerModel {
  public static async searchCustomer(
    input: ISearchCustomersInput,
  ): Promise<IListResponse<ICustomer>> {
    if (input.filterText.trim().length < 2) {
      return { count: 0, rows: [] };
    }

    const searchTokens = input.filterText
      .split(' ')
      .filter((token: string) => token.length > 0);

    const whereConditions = searchTokens.map((token: string) => ({
      [Op.or]: [
        { firstName: { [Op.iLike]: `%${token}%` } },
        { lastName: { [Op.iLike]: `%${token}%` } },
        { email: { [Op.iLike]: `%${token}%` } },
      ],
    }));

    return await db.Customer.findAndCountAll({
      where: {
        userId: input.userId,
        [Op.and]: whereConditions,
      },
    });
  }

  public static async getCustomers(
    userId: string,
  ): Promise<IListResponse<ICustomer>> {
    return await db.Customer.findAndCountAll({
      where: { userId: userId },
    });
  }
}
