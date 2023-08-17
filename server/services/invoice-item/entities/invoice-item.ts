import { IInvoiceItem } from '../../../interfaces';

export class InvoiceItemEntity {
  public id: string;
  public name: string;
  public unitPrice: number;
  public numberOfItems: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(data: IInvoiceItem) {
    this.id = data.id;
    this.name = data.name;
    this.unitPrice = data.unitPrice;
    this.numberOfItems = data.numberOfItems;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
