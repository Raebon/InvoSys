import db from '../../../db/models';
import { IInvoiceItem } from '../../../interfaces';
import { IListResponse } from '../../../interfaces/response';

export class InvoiceItemModel {
  public static async getList(): Promise<IListResponse<IInvoiceItem>> {
    return await db.InvoiceItem.findAndCountAll();
  }
}
