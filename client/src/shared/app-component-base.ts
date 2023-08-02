import { Injector } from "@angular/core";
import { GraphqlService } from "./services/graphql.service";
import { NotificationService } from "./services/notification.service";
import { AuthService } from "./auth/auth.service";
import { InvoicesService } from "./services/invoice/invoice.service";
import { CustomerService } from "./services/customer/customer.service";

export abstract class AppComponentBase {
  graphqlService: GraphqlService;
  notifyService: NotificationService;
  authService: AuthService;
  invoiceServices: InvoicesService;
  customerServices: CustomerService;

  constructor(injector: Injector) {
    // Global services
    this.graphqlService = injector?.get(GraphqlService);
    this.notifyService = injector?.get(NotificationService);
    this.authService = injector?.get(AuthService);
    this.invoiceServices = injector?.get(InvoicesService);
    this.customerServices = injector?.get(CustomerService);
  }
}
