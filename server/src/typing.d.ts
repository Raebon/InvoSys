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

interface InvoiceResult  {
  count: number;
  rows: [Invoice]
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
  invoiceId: string;
  name: string;
  unitPrice: number;
  numberOfItems: number;
}

interface InvoiceItem extends InvoiceItemAttributes {}

interface RevenueLastThreeMonthsResult {
  month:string;
  revenue: number;
}
