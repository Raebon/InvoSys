import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AccountComponent } from "./account.component";
import { AccountRouteGuard } from "src/shared/auth/account-route-guard";

const routes: Routes = [
  {
    path: "",
    component: AccountComponent,
    children: [
      { path: "", redirectTo: "login", pathMatch: "full" },
      {
        path: "login",
        component: LoginComponent,
        canActivate: [AccountRouteGuard],
      },
      /* {
        path: "register",
        component: RegisterComponent,
        canActivate: [],
      }, */
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
