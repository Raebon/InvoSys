import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import db from '../../models';
import { invoices } from '../../seeders/invoices';

/**
 * Vytvoření záznamu ze seeedru
 * @return naplní data do tabulky Invoice ze seeders
 */
export const createInvoices = async () => {
  try {
    await Promise.all(
      invoices.map((invoice) => {
        return db.Invoice.create(invoice);
      }),
    );
  } catch (error) {
    console.error('Chyba při vytváření faktur:', error);
    throw new Error('Nepodařilo se vytvořit faktury.');
  }
};

/**
 * Seznam faktur
 * @return vrátí počet a seznam faktur
 */
export const getInvoices = async (): Promise<InvoiceResult> => {
  try {
    const invoiceData = await db.Invoice.findAndCountAll({
      include: [db.Customer, db.InvoiceItem],
    });

    const invoices = invoiceData.rows.map((invoice: Invoice) => {
      return {
        id: invoice.id,
        customerId: invoice.customerId,
        description: invoice.description,
        dateOfIssue: invoice.dateOfIssue,
        customer: invoice.Customer,
        invoiceItems: invoice.InvoiceItems,
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
export const getRevenueLastThreeMonths = async (): Promise<
  RevenueLastThreeMonthsResult[]
> => {
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
          dateOfIssue: {
            [Op.gte]: month,
            [Op.lt]: nextMonthStartDate,
          },
        },
      });

      const revenue = data.reduce((acc: number, item: Invoice) => {
        const total = item.InvoiceItems.reduce(
          (subtotal: number, item: InvoiceItem) => {
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
): Promise<GetInvoiceResult | null> => {
  try {
    const invoice = await db.Invoice.findByPk(id, {
      include: [db.Customer, db.InvoiceItem],
    });

    if (!invoice) {
      throw new Error(`Faktura s ID ${id} nebyla nalezena.`);
    }

    return {
      id: invoice.id,
      customerId: invoice.customerId,
      description: invoice.description,
      dateOfIssue: invoice.dateOfIssue,
      customer: invoice.Customer,
      invoiceItems: invoice.InvoiceItems,
    };
  } catch (error) {
    console.error(`Chyba při získávání faktury s ID ${id}:`, error);
    throw new Error(`Nepodařilo se získat fakturu s ID ${id}.`);
  }
};

/**
 * Založení nové faktury
 * @param AddInvoiceInput
 * @return založí se nová faktura
 */
export const addInvoice = async (input: AddInvoiceInput) => {
  const transaction = await db.sequelize.transaction();
  try {
    //zjištění, jestli zákazník neexistuje v DB
    let customer = await db.Customer.findOne({
      where: { email: input.customer.email },
      transaction,
    });

    //vytvoření zákazníka
    if (!customer) {
      customer = await db.Customer.create({
        id: uuidv4(),
        firstName: input.customer.firstName,
        lastName: input.customer.lastName,
        email: input.customer.email,
        transaction,
      });
    }

    //vytvoření faktury
    const invoice = await db.Invoice.create({
      id: uuidv4(),
      customerId: customer.id,
      description: input.description,
      dateOfIssue: input.dateOfIssue,
      transaction,
    });

    //vytvoření položek faktury
    const invoiceItems = input.invoiceItems.map((item) => ({
      id: uuidv4(),
      invoiceId: invoice.id,
      name: item.name,
      unitPrice: item.unitPrice,
      numberOfItems: item.numberOfItems,
    }));
    await db.InvoiceItem.bulkCreate(invoiceItems, { transaction });

    await transaction.commit();

    return {
      id: invoice.id,
      customerId: customer.id,
      description: invoice.description,
      dateOfIssue: invoice.dateOfIssue,
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
 * Update faktury
 * @param UpdateInvoiceInput
 * @return aktualizuje se nová faktura
 */
export const updateInvoice = async (input: UpdateInvoiceInput) => {
  const transaction = await db.sequelize.transaction();
  try {
    // vytáhnout aktuální data zákazníka z DB podle emailu
    let customer = await db.Customer.findOne({
      where: { email: input.customer.email },
      transaction,
    });

    if (!customer) {
      // záznam neexistuje => vytvořit
      await db.Customer.create({
        id: uuidv4(),
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
    let invoice = await db.Invoice.update(
      {
        customerId: customer.id,
        description: input.description,
        dateOfIssue: input.dateOfIssue,
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

    const invoiceItems = input.invoiceItems.map((item) => ({
      id: item.id || uuidv4(),
      invoiceId: input.id,
      name: item.name,
      unitPrice: item.unitPrice,
      numberOfItems: item.numberOfItems,
    }));

    await db.InvoiceItem.bulkCreate(invoiceItems, { transaction });

    await transaction.commit();

    // vrátit upravenou fakturu
    let updatedInvoice = await db.Invoice.findByPk(input.id, {
      include: [db.Customer, db.InvoiceItem],
    });

    if (!invoice) {
      throw new Error('Faktura nebyla nalezena');
    }

    return {
      id: updatedInvoice.id,
      customerId: updatedInvoice.customerId,
      description: updatedInvoice.description,
      dateOfIssue: updatedInvoice.dateOfIssue,
      customer: updatedInvoice.Customer,
      invoiceItems: updatedInvoice.InvoiceItems,
    };
  } catch (error) {
    await transaction.rollback();
    console.error('updateInvoice - chyba při aktualizaci faktury', error);
    throw new Error('Při aktualizaci faktury došlo k chybě!');
  }
};
