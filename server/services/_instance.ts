import { CustomerService } from './customer';
import { InvoiceService } from './invoice';
import { InvoiceItemService } from './invoice-item';
import { UserService } from './user';

export class Instance {
  private _customer;
  private _user;
  private _invoice;
  private _invoiceItem;

  constructor() {
    this._customer = new CustomerService(this);
    this._user = new UserService(this);
    this._invoice = new InvoiceService(this);
    this._invoiceItem = new InvoiceItemService(this);
  }

  get user(): UserService {
    return this._user;
  }

  get customer(): CustomerService {
    return this._customer;
  }

  get invoice(): InvoiceService {
    return this._invoice;
  }

  get invoiceItem(): InvoiceItemService {
    return this._invoiceItem;
  }
}
