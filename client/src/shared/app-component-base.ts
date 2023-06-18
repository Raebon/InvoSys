import { Injector } from "@angular/core";
import { GraphqlService } from "./services/graphql.service";
import { NotificationService } from "./services/notification.service";
import { AuthService } from "./auth/auth.service";

export abstract class AppComponentBase {
  graphqlService: GraphqlService;
  notifyService: NotificationService;
  authService: AuthService;

  constructor(injector: Injector) {
    // Global services
    this.graphqlService = injector?.get(GraphqlService);
    this.notifyService = injector?.get(NotificationService);
    this.authService = injector?.get(AuthService);
  }
}
