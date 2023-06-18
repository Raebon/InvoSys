import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { AccountComponent } from "./account.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AccountRoutingModule } from "./account-routing.module";
import { SharedModule } from "src/shared/shared.module";
import { AccountRouteGuard } from "src/shared/auth/account-route-guard";

@NgModule({
  declarations: [AccountComponent, LoginComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [AccountRouteGuard],
  //bootstrap: [AccountComponent],
})
export class AccountModule {}
