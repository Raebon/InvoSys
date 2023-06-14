import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './layout/navbar.component';
import { InvoicesManagementComponent } from './invoices-management/invoices-management.component';
import { RevenueLastThreeMonthsComponent } from './invoices-management/revenue-last-three-months/revenue-last-three-months.component';
import { InvoicesListGridComponent } from './invoices-management/invoices-list-grid/invoices-list-grid.component';
import { InvoiceAddEditComponent } from './invoice-add-edit/invoice-add-edit.component';
import { InvoiceItemComponent } from './invoice-add-edit/invoice-item/invoice-item.component';
import { ErrorValidationAlertComponent } from './components/error-validation-alert.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InvoicesManagementComponent,
    RevenueLastThreeMonthsComponent,
    InvoicesListGridComponent,
    InvoiceAddEditComponent,
    InvoiceItemComponent,
    ErrorValidationAlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
