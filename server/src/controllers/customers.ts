import { Op } from 'sequelize';
import db from '../../models';

/**
 *
 * @returns vratí seznam zákaznkíku typu CustomerResult
 */

export const getCustomers = async (
  contextValue: IUserContextValue,
): Promise<ICustomerResult> => {
  try {
    const customerData = await db.Customer.findAndCountAll({
      where: { userId: contextValue.userId },
    });

    return { count: customerData.count, rows: customerData.rows };
  } catch (error) {
    console.error('Chyba při získávání zákazníku:', error);
    throw new Error('Nepodařilo se získat zákazníky.');
  }
};

/**
 * Metoda pro získání vyfitrovaných zákazníku podle string hodnoty, která je vetší než 2 znaky
 * @returns vráti vyfiltrovaný záznamy zákazníku podle stringu
 */

export const searchCustomers = async (
  searchInput: string = '',
  contextValue: IUserContextValue,
): Promise<ICustomerResult> => {
  try {
    if (searchInput.trim().length < 2) {
      return { count: 0, rows: [] };
    }

    const searchTokens = searchInput
      .split(' ')
      .filter((token) => token.length > 0);

    const whereConditions = searchTokens.map((token) => ({
      [Op.or]: [
        { firstName: { [Op.iLike]: `%${token}%` } },
        { lastName: { [Op.iLike]: `%${token}%` } },
        { email: { [Op.iLike]: `%${token}%` } },
      ],
    }));

    const customerData = await db.Customer.findAndCountAll({
      where: {
        userId: contextValue.userId,
        [Op.and]: whereConditions,
      },
    });

    return { count: customerData.count, rows: customerData.rows };
  } catch (error) {
    console.error('Chyba při vyhledávání zákazníků:', error);
    throw new Error('Nepodařilo se vyhledat zákazníky.');
  }
};
