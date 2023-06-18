import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InvoicesManagementComponent } from "./invoices-management/invoices-management.component";
import { InvoiceAddEditComponent } from "./invoice-add-edit/invoice-add-edit.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    data: {},
    canActivate: [],
  },
  {
    path: "login",
    component: LoginComponent,
    data: {},
    canActivate: [],
  },
  {
    path: "home",
    component: HomeComponent,
    data: {},
    canActivate: [],
  },
  {
    path: "invoices-list",
    component: InvoicesManagementComponent,
    data: {},
    canActivate: [],
  },
  {
    path: "invoice/:id",
    component: InvoiceAddEditComponent,
    data: {},
    canActivate: [],
  },
  {
    path: "invoice",
    component: InvoiceAddEditComponent,
    data: {},
    canActivate: [],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
