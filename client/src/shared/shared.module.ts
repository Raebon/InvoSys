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

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  declarations: [
    SearchCustomerDropdownComponent,
    ErrorValidationAlertComponent,
  ],
  exports: [SearchCustomerDropdownComponent, ErrorValidationAlertComponent],
  providers: [{ provide: API_BASE_URL_TOKEN, useValue: API_BASE_URL }],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [GraphqlService, AuthService],
    };
  }
}
