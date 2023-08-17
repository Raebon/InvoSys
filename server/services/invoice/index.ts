import db from '../../db/models';
import {
  IAddInvoiceInput,
  IGetInvoicesBody,
  IInvoice,
} from '../../interfaces/invoice';
import { IListResponse } from '../../interfaces/response';
import { Instance } from '../_instance';
import { InvoiceModel } from './model/invoice-model';

export class InvoiceService {
  constructor(protected services: Instance) {}

  /**
   * @param IGetInvoicesBody
   * @returns {Promise.<IInvoice>}
   */
  public async create(input: IAddInvoiceInput): Promise<IInvoice> {
    const transaction = await db.sequelize.transaction();
    try {
      return await InvoiceModel.create(input, transaction);
    } catch (error) {
      await transaction.rollback();
      console.error('addInvoice - chyba při založení faktury', error);
      throw new Error('Při založení faktury došlo k chybě!');
    }
  }

  /**
   * @param IInvoice
   * @returns {Promise.<IInvoice>}
   */

  public async update(input: IInvoice): Promise<IInvoice> {
    const transaction = await db.sequelize.transaction();
    try {
      return await InvoiceModel.update(input, transaction);
    } catch (error) {
      await transaction.rollback();
      console.error('updateInvoice - chyba při aktualizaci faktury', error);
      throw new Error('Při aktualizaci faktury došlo k chybě!');
    }
  }

  public async delete(invoiceId: string) {
    const transaction = await db.sequelize.transaction();
    try {
      return await InvoiceModel.delete(invoiceId, transaction);
    } catch (error) {
      await transaction.rollback();
      console.error('Chyba při odstraňování faktury:', error);
      throw new Error('Nepodařilo se odstranit fakturu.');
    }
  }

  /**
   * @param IGetInvoicesBody
   * @returns {Promise.<IInvoice[]>}
   */
  public async getList(
    input: IGetInvoicesBody,
  ): Promise<IListResponse<IInvoice>> {
    try {
      return await InvoiceModel.getList(input);
    } catch (error) {
      console.error('Chyba při získávání faktur:', error);
      throw new Error('Nepodařilo se získat faktury.');
    }
  }
  /**
   * @param invoiceId
   * @returns {Promise.<IInvoice>}
   */
  public async byId(invoiceId: string): Promise<IInvoice> {
    try {
      return await InvoiceModel.byId(invoiceId);
    } catch (error) {
      console.error(`Chyba při získávání faktury s ID ${invoiceId}:`, error);
      throw new Error(`Nepodařilo se získat fakturu s ID ${invoiceId}.`);
    }
  }

  /**
   * @param userId
   * @returns {Promise.<any[]>}
   */
  public async lastThreeMonthsRevenue(userId: string): Promise<number[]> {
    try {
      return await InvoiceModel.lastThreeMonthsRevenue(userId);
    } catch (error) {
      console.error('Chyba při získávání tržeb:', error);
      throw new Error('Nepodařilo se získat tržby za poslední tři měsíce.');
    }
  }
}
