import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InvoicesManagementComponent } from "./invoices-management/invoices-management.component";
import { InvoiceAddEditComponent } from "./invoice-add-edit/invoice-add-edit.component";

const routes: Routes = [
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
