type SortOrder = {
  field: string;
  direction: "ASC" | "DESC";
};

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}
interface IGetInvoicesBody {
  order?: SortOrder;
  filterText?: string;
  currentPage: number;
  pageSize: number;
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
  userId?: string;
  customerId?: string;
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
  __typename?: string;
}

interface InvoiceItemResult {
  count: number;
  rows: [IInvoiceItem];
}

interface RevenueLastThreeMonthsResult {
  month: string;
  revenue: number;
}

type TInvoiceItemInput = Partial<IInvoiceItem>;
type TCustomerInput = Partial<ICustomer>;
type TInvoiceInput = Partial<IInvoice>;

interface IInvoiceInput extends TInvoiceInput {
  inputCustomer: TCustomerInput;
  inputInvoiceItems: TInvoiceItemInput[];
}

interface DeleteInvoiceResponse {
  success: boolean;
  message: string;
}
