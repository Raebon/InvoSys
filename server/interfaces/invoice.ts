import { IUser } from './user';
import { ICustomer } from './customer';
import { IInvoiceItem } from './invoice-item';
import { SortOrder } from './sort-order';

export interface IInvoice {
  id: string;
  description: string;
  dateOfIssue: Date;
  dueDate: Date;
  variableNumber: number;
  userId?: string;
  customerId?: string;
  user: IUser;
  customer: ICustomer;
  invoiceItems: IInvoiceItem[];
}

export interface IAddInvoiceInput {
  userId: string;
  description: string;
  dateOfIssue: string;
  dueDate: Date;
  variableNumber: number;
  invoiceItems: IInvoiceItem[];
  customer: ICustomer;
}

export interface IGetInvoicesBody {
  userId: string;
  body: {
    order?: SortOrder;
    filterText?: string;
    currentPage: number;
    pageSize: number;
  };
}
