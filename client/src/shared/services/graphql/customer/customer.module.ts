import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SearchCustomersService } from "./search-customers.service";

@NgModule({
  imports: [CommonModule],
  providers: [SearchCustomersService],
})
export class CustomerModule {}
