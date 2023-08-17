export interface IInvoiceItem {
  id: string;
  name: string;
  unitPrice: number;
  numberOfItems: number;
  createdAt?: Date;
  updatedAt?: Date;
}
