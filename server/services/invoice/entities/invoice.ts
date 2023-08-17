import { ICustomer, IInvoice, IInvoiceItem, IUser } from '../../../interfaces';

export class InvoiceEntity {
  public id: string;
  public description: string;
  public dateOfIssue: Date;
  public dueDate: Date;
  public variableNumber: number;
  public userId?: string;
  public customerId?: string;
  public user: IUser;
  public customer: ICustomer;
  public invoiceItems: IInvoiceItem[];

  constructor(data: IInvoice) {
    this.id = data.id;
    this.description = data.description;
    this.dateOfIssue = data.dateOfIssue;
    this.dueDate = data.dueDate;
    this.variableNumber = data.variableNumber;
    this.userId = data.userId;
    this.customerId = data.customerId;
    this.user = data.user;
    this.customer = data.customer;
    this.invoiceItems = data.invoiceItems;
  }
}
