import { Component, OnInit, Injector } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { format } from "date-fns";
import { AppComponentBase } from "../../shared/app-component-base";
import {
  CREATE_INVOICE,
  GET_INVOICE_BY_ID,
  UPDATE_INVOICE,
} from "./invoice-add-edit.data";

@Component({
  selector: "app-invoice-add-edit",
  templateUrl: "./invoice-add-edit.component.html",
  styleUrls: ["./invoice-add-edit.component.css"],
})
export class InvoiceAddEditComponent
  extends AppComponentBase
  implements OnInit
{
  title: string;
  buttonLabel: string;
  newInvoiceItem: Partial<IInvoiceItem>;
  invoiceId: string | null;
  currentDate: Date;
  invoiceDetail: FormGroup;
  invoiceItems: TInvoiceItemInput[];
  selectedCustomerFromDropdown: ICustomer | undefined;

  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    super(injector);
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
      dueDate: [
        format(
          this.currentDate.setDate(this.currentDate.getDate() + 30),
          "yyyy-MM-dd"
        ),
        Validators.required,
      ],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", Validators.required],
      variableNumber: [
        "",
        [Validators.required, Validators.pattern("[0-9]{1,10}")],
      ],
    });
    this.invoiceItems = [this.newInvoiceItem];
  }

  private createInvoice(input: IInvoiceInput) {
    try {
      this.invoiceServices
        .createInvoice(input, CREATE_INVOICE)
        .subscribe((res) => {
          this.notifyService.showSuccess(
            "Faktura byla úspěšně vytvořena",
            "Úspěšná akce!"
          );

          this.router.navigate(["/app/invoices-list"]);
        });
    } catch (error) {
      this.notifyService.showError(
        "Faktura nebyla vytvořena",
        "Neúspěšná akce!"
      );
    }
  }

  private editInvoice(input: IInvoiceInput) {
    try {
      this.invoiceServices
        .updateInvoice(input, UPDATE_INVOICE)
        .subscribe((res) => {
          this.notifyService.showSuccess(
            "Faktura byla úspěšně aktualizovaná",
            "Úspěšná akce!"
          );
          this.router.navigate(["/app/invoices-list"]);
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

    const invoiceInput: IInvoiceInput = {
      description: this.invoiceDetail.value.description!,
      dateOfIssue: this.invoiceDetail.value.dateOfIssue!,
      dueDate: this.invoiceDetail.value.dueDate!,
      variableNumber: Number(this.invoiceDetail.value.variableNumber!),
      inputCustomer: {
        firstName: this.invoiceDetail.value.firstName!,
        lastName: this.invoiceDetail.value.lastName!,
        email: this.invoiceDetail.value.email!,
      },
      inputInvoiceItems: this.invoiceItems,
    };

    if (!this.invoiceId) {
      //vytvoření
      this.createInvoice(invoiceInput);
    } else {
      //editace
      invoiceInput.id = this.invoiceId;
      /*    const updateInvoiceInput: IInvoiceInput = {
        id: this.invoiceId,
        description: this.invoiceDetail.value.description!,
        dateOfIssue: this.invoiceDetail.value.dateOfIssue!,
        variableNumber: this.invoiceDetail.value.variableNumber!,
        inputCustomer: {
          firstName: this.invoiceDetail.value.firstName!,
          lastName: this.invoiceDetail.value.lastName!,
          email: this.invoiceDetail.value.email!,
        },
        inputInvoiceItems: this.invoiceItems,
      }; */
      this.editInvoice(invoiceInput);
    }
  }

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get("id");

    if (this.invoiceId) {
      //Editace
      this.buttonLabel = "Editace";
      this.getInvoiceByIdDataToFormIfEdit(this.invoiceId);
    } else {
      //Vytvoření
      this.title = "Vytvoření faktury";
      this.buttonLabel = "Vytvořit";
    }
  }

  public getSelectedCustomerFromDropdown(event: ICustomer): void {
    this.selectedCustomerFromDropdown = event;
    this.updateOrResetCustomerFormDetail(event);
  }

  public resetSelectedCustomerFromDropdown(): void {
    this.selectedCustomerFromDropdown = undefined;
    this.updateOrResetCustomerFormDetail(undefined);
  }

  public updateOrResetCustomerFormDetail(event: ICustomer | undefined): void {
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
    this.invoiceServices
      .getInvoiceById(invoiceId, GET_INVOICE_BY_ID)
      .subscribe((data) => {
        this.invoiceItems = data.invoiceItems!.map((obj) => {
          const { __typename, ...rest } = obj;
          return rest;
        });
        this.title = `Editace faktury - ${data.variableNumber}`;
        this.selectedCustomerFromDropdown = data.customer;

        this.invoiceDetail.patchValue({
          description: data.description,
          dateOfIssue: data.dateOfIssue,
          dueDate: data.dueDate,
          variableNumber: data.variableNumber,
          firstName: data.customer?.firstName,
          lastName: data.customer?.lastName,
          email: data.customer?.email,
        });
      });
  }

  public onUpdateInvoiceItemFormValue(event: {
    item: TInvoiceItemInput;
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

  public trackByFn(index: number, item: TInvoiceItemInput): string | number {
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
      totalPrice += item.numberOfItems! * item.unitPrice!;
    });
    return totalPrice;
  }

  get hasCustomerFromDropdown(): boolean {
    return !!this.selectedCustomerFromDropdown?.id;
  }
}
