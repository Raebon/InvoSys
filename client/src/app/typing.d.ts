type SortOrder = {
  field: string;
  direction: "ASC" | "DESC";
};

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}
interface GetInvoicesBody {
  filterText?: string;
  order?: SortOrder;
  currentPage: number;
  pageSize: number;
}

interface LoginResponse {
  error: boolean;
  message: string;
  token: string | null;
  expiresIn: number;
}

interface SignOutInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
interface SignInInput {
  email: string;
  password: string;
}

interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface CustomerAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Customer extends CustomerAttributes {}

interface InvoiceAttributes {
  id: string;
  customerId: string;
  description: string;
  dateOfIssue: Date;
}

interface InvoiceResult {
  count: number;
  rows: [Invoice];
}

interface CustomerResult {
  count: number;
  rows: [Customer] | [];
}

interface GetInvoiceResult extends InvoiceAttributes {
  customer: Customer;
  invoiceItems: InvoiceItem[];
}

interface Invoice extends InvoiceAttributes {
  customer: Customer;
  invoiceItems: InvoiceItem[];
}

interface InvoiceItemAttributes {
  id?: string;
  invoiceId?: string;
  name: string;
  unitPrice: number;
  numberOfItems: number;
}

interface InvoiceItem extends InvoiceItemAttributes {
  __typename?: string;
}

interface RevenueLastThreeMonthsResult {
  month: string;
  revenue: number;
}

interface AddInvoiceInput {
  description: string;
  dateOfIssue: Date;
  customer: AddCustomerInput;
  invoiceItems: AddInvoiceItemInput[];
}

interface AddCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
}

interface AddInvoiceItemInput {
  name: string;
  unitPrice: number;
  numberOfItems: number;
}

interface UpdateInvoiceInput {
  id: string;
  customerId?: string;
  description: string;
  dateOfIssue: Date;
  customer: UpdateCustomerInput;
  invoiceItems: UpdateInvoiceItemInput[];
}

interface UpdateCustomerInput {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface UpdateInvoiceItemInput {
  id?: string;
  invoiceId?: string;
  name: string;
  unitPrice: number;
  numberOfItems: number;
}
