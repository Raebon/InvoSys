import { IInvoiceItem } from '../../interfaces';
import { IListResponse } from '../../interfaces/response';
import { Instance } from '../_instance';
import { InvoiceItemModel } from './model/invoice-item-model';

export class InvoiceItemService {
  constructor(protected servise: Instance) {}

  /**
   * @returns {Promise.<IInvoiceItem[]>}
   */
  public async getList(): Promise<IListResponse<IInvoiceItem>> {
    try {
      return await InvoiceItemModel.getList();
    } catch (error) {
      console.error('Chyba při získávání položek faktur:', error);
      throw new Error('Nepodařilo se získat položky faktur.');
    }
  }
}
