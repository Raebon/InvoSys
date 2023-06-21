import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { AppRouteGuard } from "src/shared/auth/app-route-guard";
import { SharedModule } from "src/shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { InvoiceAddEditComponent } from "./invoice-add-edit/invoice-add-edit.component";
import { InvoiceItemComponent } from "./invoice-add-edit/invoice-item/invoice-item.component";
import { InvoicesListGridComponent } from "./invoices-management/invoices-list-grid/invoices-list-grid.component";
import { InvoicesManagementComponent } from "./invoices-management/invoices-management.component";
import { RevenueLastThreeMonthsComponent } from "./invoices-management/revenue-last-three-months/revenue-last-three-months.component";
import { NavbarComponent } from "./layout/navbar.component";
import { InvoicesGridActionsComponent } from "./invoices-management/invoices-list-grid/invoices-grid-actions.component";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InvoicesManagementComponent,
    RevenueLastThreeMonthsComponent,
    InvoicesListGridComponent,
    InvoiceAddEditComponent,
    InvoiceItemComponent,
    HomeComponent,
    InvoicesGridActionsComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [AppRouteGuard],
})
export class AppModule {}
