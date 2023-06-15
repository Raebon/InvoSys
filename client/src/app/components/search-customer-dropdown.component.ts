import { Component, EventEmitter, Output } from "@angular/core";
import { GraphqlService } from "../services/graphql.service";
import { debounceTime, distinctUntilChanged, finalize } from "rxjs/operators";

@Component({
  selector: "app-search-customer-dropdown",
  templateUrl: "./search-customer-dropdown.component.html",
})
export class SearchCustomerDropdownComponent {
  @Output() selectedCustomer = new EventEmitter<Customer>();

  count: number = 0;
  customers: Customer[] = [];
  filterText: string = "";
  loading: boolean = false;
  isDropdownOpen: boolean = false;

  constructor(private graphqlService: GraphqlService) {}

  ngOnInit(): void {
    document.addEventListener("click", this.handleOutsideClick.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener("click", this.handleOutsideClick.bind(this));
  }

  getCustomers(text: string): void {
    if (text.length < 3) {
      return;
    }
    text = text.toLowerCase();
    this.loading = true;
    this.graphqlService
      .searchCustomers(text)
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        finalize(() => (this.loading = false))
      )
      .subscribe((response) => {
        this.customers = response.rows;
        this.count = response.count;
        if (this.count > 0) {
          this.openDropdown();
        }
      });
  }

  selectCustomer(customer: Customer): void {
    this.filterText = `${customer.firstName} ${customer.lastName}`;
    this.selectedCustomer.emit(customer);
  }

  openDropdown(): void {
    this.isDropdownOpen = true;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  handleOutsideClick(event: Event): void {
    const targetElement = event.target as Element;
    if (!targetElement.closest(".relative")) {
      this.closeDropdown();
    }
  }
}
