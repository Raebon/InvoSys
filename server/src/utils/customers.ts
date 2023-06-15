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

export const getCustomers = async (): Promise<CustomerResult> => {
  try {
    const customerData = await db.Customer.findAndCountAll();

    const customers = await customerData.rows.map((customer: Customer) => {
      return {
        id: customer.id,
        firsName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
      };
    });

    return { count: customers, rows: customers };
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
): Promise<CustomerResult> => {
  try {
    const searchTokens = searchInput
      .split(' ')
      .filter((token) => token.length > 0);
    console.log(searchInput?.trim());
    if (searchInput.trim().length < 2) {
      return { count: 0, rows: [] };
    }
    const whereConditions = searchTokens.map((token) => ({
      [Op.or]: [
        { firstName: { [Op.like]: `%${token}%` } },
        { lastName: { [Op.like]: `%${token}%` } },
        { email: { [Op.like]: `%${token}%` } },
      ],
    }));

    const customerData = await db.Customer.findAndCountAll({
      where: {
        [Op.and]: whereConditions,
      },
    });

    const customers = customerData.rows.map((customer: Customer) => {
      return {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
      };
    });

    return { count: customers.length, rows: customers };
  } catch (error) {
    console.error('Chyba při vyhledávání zákazníků:', error);
    throw new Error('Nepodařilo se vyhledat zákazníky.');
  }
};
