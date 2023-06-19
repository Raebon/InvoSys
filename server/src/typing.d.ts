interface UserContextValueI {
  userId: string;
  email: string;
  iat: number;
  exp: number;
  sub: string;
}

interface ContextValueI {
  user: UserContextValueI;
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
interface CustomerResult {
  count: number;
  rows: [Customer] | [];
}

interface InvoiceAttributes {
  id: string;
  //customerId: string;
  description: string;
  dateOfIssue: Date;
}

interface InvoiceResult {
  count: number;
  rows: [Invoice];
}
interface GetInvoiceResult extends InvoiceAttributes {
  customer: Customer;
  invoiceItems: InvoiceItem[];
}

interface Invoice extends InvoiceAttributes {
  Customer: Customer;
  InvoiceItems: InvoiceItem[];
}

interface InvoiceItemAttributes {
  id: string;
  name: string;
  unitPrice: number;
  numberOfItems: number;
}

interface InvoiceItem extends InvoiceItemAttributes {}

interface InvoiceItemResult {
  count: number;
  rows: [InvoiceItem];
}

interface RevenueLastThreeMonthsResult {
  month: string;
  revenue: number;
}

interface Invoice {
  id: string;
  customerId: string;
  description: string;
  dateOfIssue: Date;
  customer: Customer;
  invoiceItems: InvoiceItem[];
}

interface AddInvoiceInput {
  customerId: string;
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

interface DeleteInvoiceResponse {
  success: boolean;
  message: string;
}
