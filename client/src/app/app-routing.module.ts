import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesManagementComponent } from './invoices-management/invoices-management.component';

const routes: Routes = [
  {
  path: 'invoices-list',
  component: InvoicesManagementComponent,
  data: { },
  canActivate: []
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
