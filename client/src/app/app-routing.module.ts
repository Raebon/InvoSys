import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InvoicesManagementComponent } from "./invoices-management/invoices-management.component";
import { InvoiceAddEditComponent } from "./invoice-add-edit/invoice-add-edit.component";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { AppRouteGuard } from "src/shared/auth/app-route-guard";

const routes: Routes = [
  {
    path: "",
    component: AppComponent,
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      {
        path: "home",
        component: HomeComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: "invoices-list",
        component: InvoicesManagementComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: "invoice/:id",
        component: InvoiceAddEditComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: "invoice",
        component: InvoiceAddEditComponent,
        canActivate: [AppRouteGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
