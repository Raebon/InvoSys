import { Op, Transaction } from 'sequelize';
import db from '../../../db/models';
import { IInvoice, IInvoiceItem } from '../../../interfaces';
import {
  IAddInvoiceInput,
  IGetInvoicesBody,
} from '../../../interfaces/invoice';
import { InvoiceEntity } from '../entities/invoice';
import { generateOrderBy } from '../../../utils/generateOrderBy';
import { IListResponse } from '../../../interfaces/response';
import { v4 as uuidv4 } from 'uuid';

export class InvoiceModel {
  public static async create(
    input: IAddInvoiceInput,
    transaction: Transaction,
  ): Promise<IInvoice> {
    //zjištění, jestli zákazník neexistuje v DB
    let customer = await db.Customer.findOne({
      where: {
        email: input.customer.email,
        userId: input.userId,
      },
      transaction,
    });

    //vytvoření zákazníka
    if (!customer) {
      customer = await db.Customer.create({
        userId: input.userId,
        firstName: input.customer.firstName,
        lastName: input.customer.lastName,
        email: input.customer.email,
        transaction,
      });
    }

    //vytvoření faktury
    let invoice: IInvoice = await db.Invoice.create({
      userId: input.userId,
      customerId: customer.id,
      description: input.description,
      dateOfIssue: input.dateOfIssue,
      dueDate: input.dueDate,
      variableNumber: input.variableNumber,
      transaction,
    });

    const newInvoice = new InvoiceEntity(invoice);

    //vytvoření položek faktury
    const invoiceItems: Omit<IInvoiceItem, 'id'>[] = input.invoiceItems.map(
      (item: IInvoiceItem) => ({
        invoiceId: invoice.id,
        name: item.name,
        unitPrice: item.unitPrice,
        numberOfItems: item.numberOfItems,
      }),
    );

    const newInvoiceItems = await db.InvoiceItem.bulkCreate(invoiceItems, {
      transaction,
    });

    newInvoice.invoiceItems = newInvoiceItems;

    await transaction.commit();

    return newInvoice;
  }

  public static async delete(invoiceId: string, transaction: Transaction) {
    // odstranění faktury
    console.log(invoiceId);
    await db.Invoice.destroy({ where: { id: invoiceId }, transaction });

    await transaction.commit();

    return {
      success: true,
      message: 'Faktura byla úspěšně odstraněna.',
    };
  }

  public static async getList(
    input: IGetInvoicesBody,
  ): Promise<IListResponse<IInvoice>> {
    const { currentPage, pageSize, order, filterText } = input.body;

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
      .filter((token: string) => token.length > 0);

    const whereConditions = searchTokens.map((token: string) => ({
      [Op.or]: [
        { '$customer.firstName$': { [Op.iLike]: `%${token}%` } },
        { '$customer.lastName$': { [Op.iLike]: `%${token}%` } },
        { '$Invoice.variableNumber$': parseInt(token) },
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
        userId: input.userId,
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

    const invoices = invoiceData.rows.map((item: IInvoice) => {
      const invoice = new InvoiceEntity(item);
      return invoice;
    });
    return {
      count: invoiceData.count,
      rows: invoices,
    };
  }

  public static async byId(invoiceId: string): Promise<IInvoice> {
    const invoice: IInvoice = await db.Invoice.findByPk(invoiceId, {
      include: [db.Customer, db.InvoiceItem, db.User],
    });
    const searchInvoice = new InvoiceEntity(invoice);
    if (!invoice) {
      throw new Error(`Faktura s ID ${invoiceId} nebyla nalezena.`);
    }

    return searchInvoice;
  }

  public static async lastThreeMonthsRevenue(
    userId: string,
  ): Promise<Array<number>> {
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
          userId: userId,
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
  }

  public static async update(
    input: IInvoice,
    transaction: Transaction,
  ): Promise<IInvoice> {
    // vytáhnout aktuální data zákazníka z DB podle emailu
    let customer = await db.Customer.findOne({
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
    const invoice = await db.Invoice.update(
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

    const invoiceItems = input.invoiceItems.map((item: any) => ({
      id: item.id || uuidv4(),
      invoiceId: input.id,
      name: item.name,
      unitPrice: item.unitPrice,
      numberOfItems: item.numberOfItems,
    }));

    const updatedInvoiceItems = await db.InvoiceItem.bulkCreate(invoiceItems, {
      transaction,
    });

    const updatedInvoice = new InvoiceEntity(input);
    updatedInvoice.customer.id = customer.id;
    updatedInvoice.invoiceItems = updatedInvoiceItems;
    await transaction.commit();

    if (!invoice) {
      throw new Error('Faktura nebyla nalezena');
    }

    return updatedInvoice;
  }
}
