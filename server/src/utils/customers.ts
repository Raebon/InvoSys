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
