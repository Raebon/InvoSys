import { Injectable } from "@angular/core";
import { SearchCustomersService } from "../graphql/customer/search-customers.service";
import { Observable, map } from "rxjs";
import { DocumentNode } from "graphql";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  constructor(private searchCustomersService: SearchCustomersService) {}

  searchCustomers(
    text: string = "",
    query: DocumentNode
  ): Observable<ICustomerResult> {
    return this.searchCustomersService
      .searchCustomers(text, query)
      .valueChanges.pipe(
        map((res) => {
          return res.data.customer.searchCustomers;
        })
      );
  }
}
