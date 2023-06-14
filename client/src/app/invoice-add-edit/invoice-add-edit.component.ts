import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GraphqlService } from "../services/graphql.service";
import { FormControl, FormGroup } from "@angular/forms";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

@Component({
  selector: "app-invoice-add-edit",
  templateUrl: "./invoice-add-edit.component.html",
  styleUrls: ["./invoice-add-edit.component.css"],
})
export class InvoiceAddEditComponent implements OnInit {
  invoiceId: string | null = null;

  currentDate: Date = new Date();

  invoiceDetail = new FormGroup({
    description: new FormControl(""),
    dateOfIssue: new FormControl<Date | undefined>(
      format(this.currentDate, "yyyy-MM-dd") as any
    ),
    firstName: new FormControl(""),
    lastName: new FormControl(""),
    email: new FormControl(""),
  });

  newInvoiceId = uuidv4();

  invoiceItems: InvoiceItem[] = [
    {
      //id: uuidv4(),
      //invoiceId: this.newInvoiceId,
      name: "",
      numberOfItems: 0,
      unitPrice: 0,
    },
  ];

  title: string = "Vytvoření faktury";
  buttonLabel: string = "Vytvořit";
  constructor(
    private route: ActivatedRoute,
    private graphqlService: GraphqlService
  ) {
    this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
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

  public getInvoiceByIdDataToFormIfEdit(invoiceId: string): void {
    this.graphqlService.getInvoiceById(invoiceId).subscribe((data) => {
      console.log(data, this.currentDate, data.dateOfIssue);

      this.invoiceItems = data.invoiceItems;
      this.invoiceDetail.patchValue({
        description: data.description,
        dateOfIssue: data.dateOfIssue,
        firstName: data.customer.firstName,
        lastName: data.customer.lastName,
        email: data.customer.email,
      });
    });
  }

  public onSubmit() {
    if (this.invoiceDetail.invalid) {
      return alert("nevalidní formulář");
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
      console.log(createInvoiceInput);
      this.createInvoice(createInvoiceInput);
    } else {
      //editace
      this.editInvoice();
    }
    console.log(this.invoiceDetail.value, this.invoiceItems);
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
    this.invoiceItems = [
      ...this.invoiceItems,
      {
        name: "",
        numberOfItems: 0,
        unitPrice: 0,
      },
    ];
  }

  public trackByFn(index: number): number {
    return index;
  }

  private createInvoice(input: AddInvoiceInput) {
    try {
      console.log(input);
      return this.graphqlService.createInvoice(input);
    } catch (error) {
      console.log(error);
    }
  }

  private editInvoice(input?: any) {
    console.log(input);
  }
}
