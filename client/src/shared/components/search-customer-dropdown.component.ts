import { Component, EventEmitter, Output } from "@angular/core";
import { debounceTime, distinctUntilChanged, finalize } from "rxjs/operators";
import { CustomerService } from "../services/customer/customer.service";
import { SEARCH_CUSTOMERS } from "./search-customer-dropdown.data";

@Component({
  selector: "app-search-customer-dropdown",
  templateUrl: "./search-customer-dropdown.component.html",
})
export class SearchCustomerDropdownComponent {
  @Output() selectedCustomer = new EventEmitter<ICustomer>();

  count: number;
  customers: ICustomer[];
  filterText: string;
  loading: boolean;
  isDropdownOpen: boolean;

  constructor(private customerService: CustomerService) {
    this.count = 0;
    this.customers = [];
    this.filterText = "";
    this.loading = false;
    this.isDropdownOpen = false;
  }

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
    this.loading = true;
    this.customerService
      .searchCustomers(text, SEARCH_CUSTOMERS)
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((response) => {
        this.loading = false;
        this.customers = response.rows;
        this.count = response.count;
        if (this.count > 0) {
          this.openDropdown();
        }
      });
  }

  selectCustomer(customer: ICustomer): void {
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
