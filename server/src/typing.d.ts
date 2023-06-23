type SortOrder = {
  field: string;
  direction: 'ASC' | 'DESC';
};
interface IGetInvoicesBody {
  order?: SortOrder;
  filterText?: string;
  currentPage: number;
  pageSize: number;
}
interface IUserContextValue {
  userId: string;
  email: string;
  iat: number;
  exp: number;
  sub: string;
}

interface IContextValue {
  user: IUserContextValue;
}

interface LoginResponse {
  error: boolean;
  message: string;
  token: string | null;
  expiresIn: number;
}

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface ICustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ICustomerResult {
  count: number;
  rows: [ICustomer] | [];
}

interface IInvoice {
  id: string;
  description: string;
  dateOfIssue: Date;
  customerId: string;
  user: IUser;
  customer: ICustomer;
  invoiceItems: IInvoiceItem[];
}

interface IInvoiceResult {
  count: number;
  rows: [IInvoice];
}

interface IInvoiceItem {
  id: string;
  name: string;
  unitPrice: number;
  numberOfItems: number;
}

interface InvoiceItemResult {
  count: number;
  rows: [IInvoiceItem];
}

interface RevenueLastThreeMonthsResult {
  month: string;
  revenue: number;
}

type TCreateInvoiceInput = Omit<IInvoice, 'id'> & {
  customer: Omit<ICustomer, 'id'>;
  invoiceItems: Omit<IInvoiceItem, 'id'>;
};
interface IUpdateInvoiceInput extends IInvoice {
  customerId?: string;
  userId?: string;
}

interface DeleteInvoiceResponse {
  success: boolean;
  message: string;
}
