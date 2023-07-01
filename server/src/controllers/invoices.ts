import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import db from '../../models';
import { Model } from 'sequelize';
import { generateOrderBy } from '../utils/generateOrderBy';

interface InvoiceModel extends IInvoice, Model {}
interface CustomerModel extends ICustomer, Model {}
/**
 * Seznam faktur
 * @return vrátí počet a seznam faktur
 */
export const getInvoices = async (
  params: IGetInvoicesBody,
  contextValue: IUserContextValue,
): Promise<IInvoiceResult> => {
  try {
    const { currentPage, pageSize, order, filterText } = params;

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
      .filter((token) => token.length > 0);

    const whereConditions = searchTokens.map((token) => ({
      [Op.or]: [
        { '$customer.firstName$': { [Op.iLike]: `%${token}%` } },
        { '$customer.lastName$': { [Op.iLike]: `%${token}%` } },
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
        userId: contextValue.userId,
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
};

/**
 * Obraty vystavených faktur za poslední 3 měsíce
 * @return vrátí obraty z faktur za jednotlivé poslední 3 měsíce
 */

export const getRevenueLastThreeMonths = async (
  contextValue: IUserContextValue,
): Promise<RevenueLastThreeMonthsResult[]> => {
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
          userId: contextValue.userId,
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
    const theMonthBeforeRevenue = await getRevenuesFromInvoicesBySelectedMonth(
      theMonthBefore,
    );

    return [thisMonthRevenue, lastMonthRevenue, theMonthBeforeRevenue];
  } catch (error) {
    console.error('Chyba při získávání tržeb:', error);
    throw new Error('Nepodařilo se získat tržby za poslední tři měsíce.');
  }
};

/**
 * Vyhledat fakturu podle id
 * @param id Id faktury
 * @return vrátí detail faktury podle id
 */
export const getInvoiceById = async (
  id: string,
): Promise<Omit<IInvoice, 'customerId'> | null> => {
  try {
    const invoice: Omit<IInvoice, 'customerId'> = await db.Invoice.findByPk(
      id,
      {
        include: [db.Customer, db.InvoiceItem, db.User],
      },
    );

    if (!invoice) {
      throw new Error(`Faktura s ID ${id} nebyla nalezena.`);
    }

    return {
      id: invoice.id,
      description: invoice.description,
      dateOfIssue: invoice.dateOfIssue,
      dueDate: invoice.dueDate,
      user: invoice.user,
      customer: invoice.customer,
      invoiceItems: invoice.invoiceItems,
      variableNumber: invoice.variableNumber,
    };
  } catch (error) {
    console.error(`Chyba při získávání faktury s ID ${id}:`, error);
    throw new Error(`Nepodařilo se získat fakturu s ID ${id}.`);
  }
};

/**
 * Založení nové faktury
 * @param TCreateInvoiceInput
 * @return založí se nová faktura
 */
export const addInvoice = async (
  input: TCreateInvoiceInput,
  contextValue: IUserContextValue,
) => {
  const transaction = await db.sequelize.transaction();
  try {
    //zjištění, jestli zákazník neexistuje v DB
    let customer: CustomerModel = await db.Customer.findOne({
      where: { email: input.customer.email, userId: contextValue.userId },
      transaction,
    });

    //vytvoření zákazníka
    if (!customer) {
      customer = await db.Customer.create({
        userId: contextValue.userId,
        firstName: input.customer.firstName,
        lastName: input.customer.lastName,
        email: input.customer.email,
        transaction,
      });
    }

    //vytvoření faktury
    const invoice: IInvoice = await db.Invoice.create({
      userId: contextValue.userId,
      customerId: customer.id,
      description: input.description,
      dateOfIssue: input.dateOfIssue,
      dueDate: input.dueDate,
      variableNumber: input.variableNumber,
      transaction,
    });

    //vytvoření položek faktury
    const invoiceItems: Omit<IInvoiceItem, 'id'>[] = input.invoiceItems.map(
      (item) => ({
        invoiceId: invoice.id,
        name: item.name,
        unitPrice: item.unitPrice,
        numberOfItems: item.numberOfItems,
      }),
    );
    await db.InvoiceItem.bulkCreate(invoiceItems, { transaction });

    await transaction.commit();

    return {
      id: invoice.id,
      customerId: customer.id,
      description: invoice.description,
      dateOfIssue: invoice.dateOfIssue,
      dueDate: invoice.dueDate,
      variableNumber: invoice.variableNumber,
      customer: customer,
      invoiceItems: invoiceItems,
    };
  } catch (error) {
    await transaction.rollback();
    console.error('addInvoice - chyba při založení faktury', error);
    throw new Error('Při založení faktury došlo k chybě!');
  }
};

/**
 *  Update faktury
 * @param TUpdateInvoiceInput
 * @return aktualizuje se nová faktura
 */
export const updateInvoice = async (input: IInvoice) => {
  const transaction = await db.sequelize.transaction();
  try {
    // vytáhnout aktuální data zákazníka z DB podle emailu
    let customer: CustomerModel = await db.Customer.findOne({
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
    const invoice: InvoiceModel = await db.Invoice.update(
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

    const invoiceItems: IInvoiceItem[] = input.invoiceItems.map((item) => ({
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
};

/**
 * odstranění faktury
 * @param id - invoiceId
 */

export const deleteInvoice = async (
  invoiceId: string,
): Promise<DeleteInvoiceResponse> => {
  const transaction = await db.sequelize.transaction();
  try {
    //vyhledáni faktury podle id
    const invoice: InvoiceModel = await db.Invoice.findByPk(invoiceId, {
      include: [db.InvoiceItem],
      transaction,
    });

    if (!invoice) {
      throw new Error('Faktura nebyla nalezena.');
    }

    // odstranění všech vazebných položek faktury s transakcí
    await Promise.all(
      invoice.invoiceItems.map((item: any) => item.destroy({ transaction })),
    );

    // odstranění faktury
    await invoice.destroy({ transaction });

    await transaction.commit();

    return {
      success: true,
      message: 'Faktura byla úspěšně odstraněna.',
    };
  } catch (error) {
    await transaction.rollback();
    console.error('Chyba při odstraňování faktury:', error);
    throw new Error('Nepodařilo se odstranit fakturu.');
  }
};
