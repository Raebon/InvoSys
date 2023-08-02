import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "./auth/auth.service";
import { GraphqlService } from "./services/graphql.service";
import { SearchCustomerDropdownComponent } from "./components/search-customer-dropdown.component";
import { ErrorValidationAlertComponent } from "./components/error-validation-alert.component";
import { API_BASE_URL_TOKEN } from "./app.tokens";
import { API_BASE_URL } from "./app-config";
import { PaginatorComponent } from "./components/paginator.component";
import { SortableColumnComponent } from "./components/sortable-column.component";
import { InvoicesService } from "./services/invoice/invoice.service";
import { ServicesModule } from "./services/service.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ServicesModule,
  ],
  declarations: [
    SearchCustomerDropdownComponent,
    ErrorValidationAlertComponent,
    PaginatorComponent,
    SortableColumnComponent,
  ],
  exports: [
    SearchCustomerDropdownComponent,
    ErrorValidationAlertComponent,
    PaginatorComponent,
    SortableColumnComponent,
  ],
  providers: [{ provide: API_BASE_URL_TOKEN, useValue: API_BASE_URL }],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        GraphqlService, //it should be replaced by services
        AuthService,
        InvoicesService,
      ],
    };
  }
}
