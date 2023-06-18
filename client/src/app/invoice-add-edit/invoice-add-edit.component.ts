import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { GraphqlService } from "../services/graphql.service";
import { NotificationService } from "../services/notification.service";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { format } from "date-fns";

@Component({
  selector: "app-invoice-add-edit",
  templateUrl: "./invoice-add-edit.component.html",
  styleUrls: ["./invoice-add-edit.component.css"],
})
export class InvoiceAddEditComponent implements OnInit {
  title: string;
  buttonLabel: string;
  newInvoiceItem: InvoiceItem;
  invoiceId: string | null;
  currentDate: Date;
  invoiceDetail: FormGroup;
  invoiceItems: InvoiceItem[];
  selectedCustomerFromDropdown: Customer | undefined;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private graphqlService: GraphqlService,
    private notifyService: NotificationService,
    private location: Location
  ) {
    this.title = "Vytvoření faktury";
    this.buttonLabel = "Vytvořit";
    this.newInvoiceItem = {
      name: "Nová položka",
      numberOfItems: 0,
      unitPrice: 0,
    };
    this.invoiceId = null;
    this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
    this.invoiceDetail = this.fb.group({
      description: ["", Validators.required],
      dateOfIssue: [
        format(this.currentDate, "yyyy-MM-dd"),
        Validators.required,
      ],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", Validators.required],
    });
    this.invoiceItems = [this.newInvoiceItem];
  }

  private createInvoice(input: AddInvoiceInput) {
    try {
      this.graphqlService.createInvoice(input).subscribe((res) => {
        this.notifyService.showSuccess(
          "Faktura byla úspěšně vytvořena",
          "Úspěšná akce!"
        );

        this.router.navigate(["invoices-list"]);
      });
    } catch (error) {
      this.notifyService.showError(
        "Faktura nebyla vytvořena",
        "Neúspěšná akce!"
      );
    }
  }

  private editInvoice(input: UpdateInvoiceInput) {
    try {
      this.graphqlService.updateInvoice(input).subscribe((res) => {
        this.notifyService.showSuccess(
          "Faktura byla úspěšně aktualizovaná",
          "Úspěšná akce!"
        );
        this.router.navigate(["invoices-list"]);
      });
    } catch (error) {
      this.notifyService.showError(
        "Faktura nebyla aktualizovaná",
        "Neúspěšná akce!"
      );
    }
  }

  public onSubmit() {
    if (this.invoiceDetail.invalid) {
      this.notifyService.showError(
        "Zkontrolujte hodnoty ve formuláři",
        "Chyba ve formuláři!"
      );
      return;
    }
    if (!this.invoiceId) {
      //vytvoření
      const createInvoiceInput: AddInvoiceInput = {
        description: this.invoiceDetail.value.description!,
        dateOfIssue: this.invoiceDetail.value.dateOfIssue!,
        customer: {
          firstName: this.invoiceDetail.value.firstName!,
          lastName: this.invoiceDetail.value.lastName!,
          email: this.invoiceDetail.value.email!,
        },
        invoiceItems: this.invoiceItems,
      };
      this.createInvoice(createInvoiceInput);
    } else {
      //editace
      const updateInvoiceInput: UpdateInvoiceInput = {
        id: this.invoiceId,
        description: this.invoiceDetail.value.description!,
        dateOfIssue: this.invoiceDetail.value.dateOfIssue!,
        customer: {
          firstName: this.invoiceDetail.value.firstName!,
          lastName: this.invoiceDetail.value.lastName!,
          email: this.invoiceDetail.value.email!,
        },
        invoiceItems: this.invoiceItems,
      };
      this.editInvoice(updateInvoiceInput);
    }
  }

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get("id");

    if (this.invoiceId) {
      //Editace
      this.title = `Editace faktury - ${this.invoiceId}`;
      this.buttonLabel = "Editace";
      this.getInvoiceByIdDataToFormIfEdit(this.invoiceId);
    } else {
      //Vytvoření
      this.title = "Vytvoření faktury";
      this.buttonLabel = "Vytvořit";
    }
  }

  public getSelectedCustomerFromDropdown(event: Customer): void {
    this.selectedCustomerFromDropdown = event;
    this.updateOrResetCustomerFormDetail(event);
  }

  public resetSelectedCustomerFromDropdown(): void {
    this.selectedCustomerFromDropdown = undefined;
    this.updateOrResetCustomerFormDetail(undefined);
  }

  public updateOrResetCustomerFormDetail(event: Customer | undefined): void {
    if (event) {
      this.invoiceDetail.patchValue({
        firstName: event.firstName,
        lastName: event.lastName,
        email: event.email,
      });
    } else {
      this.invoiceDetail.patchValue({
        firstName: "",
        lastName: "",
        email: "",
      });
    }
  }

  public getInvoiceByIdDataToFormIfEdit(invoiceId: string): void {
    this.graphqlService.getInvoiceById(invoiceId).subscribe((data) => {
      this.invoiceItems = data.invoiceItems.map((obj) => {
        const { __typename, ...rest } = obj;
        return rest;
      });
      this.selectedCustomerFromDropdown = data.customer;
      this.invoiceDetail.patchValue({
        description: data.description,
        dateOfIssue: data.dateOfIssue,
        firstName: data.customer.firstName,
        lastName: data.customer.lastName,
        email: data.customer.email,
      });
    });
  }

  public onUpdateInvoiceItemFormValue(event: {
    item: InvoiceItem;
    index: number;
  }): void {
    const { item: eventItem, index } = event;

    this.invoiceItems[index] = {
      ...this.invoiceItems[index],
      name: eventItem.name,
      numberOfItems: eventItem.numberOfItems,
      unitPrice: eventItem.unitPrice,
    };
  }

  public onDeleteInvoiceItem(invoiceItemIndex: number): void {
    this.invoiceItems.splice(invoiceItemIndex, 1);
  }

  public onAddInvoiceItem(): void {
    this.invoiceItems = [...this.invoiceItems, this.newInvoiceItem];
  }

  public trackByFn(index: number, item: InvoiceItem): string | number {
    if (item.id) {
      return item.id;
    }
    return index;
  }

  public goBack(): void {
    this.location.back();
  }

  get getTotalPriceFromInvoiceItems(): number {
    let totalPrice: number = 0;
    this.invoiceItems.map((item) => {
      totalPrice += item.numberOfItems * item.unitPrice;
    });
    return totalPrice;
  }

  get hasCustomerFromDropdown(): boolean {
    return !!this.selectedCustomerFromDropdown?.id;
  }
}
