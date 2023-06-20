import { Op } from 'sequelize';
import db from '../../models';
import { customers } from '../../seeders/customers';

/**
 *
 * @returns vytvoří zákazníky ze seeders
 */

export const createCustomers = async () => {
  try {
    await Promise.all(
      customers.map((customer) => {
        db.Customer.create(customer);
      }),
    );
  } catch (error) {
    console.error('Chyba při vytváření zákazníku:', error);
    throw new Error('Nepodařilo se vytvořit zákazníky.');
  }
};

/**
 *
 * @returns vratí seznam zákaznkíku typu CustomerResult
 */

export const getCustomers = async (
  contextValue: UserContextValueI,
): Promise<CustomerResult> => {
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
  contextValue: UserContextValueI,
): Promise<CustomerResult> => {
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
