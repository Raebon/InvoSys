export interface IInvoice {
  id: string;
  description: string;
  dateOfIssue: Date;
  dueDate: Date;
  userId?: string;
  customerId?: string;
  variableNumber?: number;
  user: IUser;
  customer: ICustomer;
  invoiceItems: IInvoiceItem[];
}

export interface IInvoiceResult {
  count: number;
  rows: [IInvoice];
}

interface IGetInvoicesBody {
  order?: SortOrder;
  filterText?: string;
  currentPage: number;
  pageSize: number;
}
