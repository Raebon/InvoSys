import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GraphqlService } from '../services/graphql.service';
import { FormControl, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-invoice-add-edit',
  templateUrl: './invoice-add-edit.component.html',
  styleUrls: ['./invoice-add-edit.component.css']
})
export class InvoiceAddEditComponent implements OnInit {
  invoiceId: string | null = null

  invoiceDetail = new FormGroup({
    description: new FormControl(''),
    dateOfIssue: new FormControl<Date | undefined>(undefined),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  })

  invoiceItems: InvoiceItem[] = [{
    id: "",
    invoiceId: "",
    name: "",
    numberOfItems: 0,
    unitPrice: 0
  }]

  title: string = "Vytvoření faktury"
  buttonLabel: string = "Vytvořit"
  constructor(
    private route: ActivatedRoute,
    private graphqlService: GraphqlService
  ) { }

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id');

    if (this.invoiceId) {
      //Editace
      this.title = `Editace faktury - ${this.invoiceId}`
      this.buttonLabel = "Editace"
      this.getInvoiceByIdDataToFormIfExists(this.invoiceId)
    } else {
      //Vytvoření
      this.title = "Vytvoření faktury";
      this.buttonLabel = "Vytvořit"
    }
  }

  public getInvoiceByIdDataToFormIfExists(invoiceId: string): void {
    this.graphqlService.getInvoiceById(invoiceId).subscribe(data => {
      console.log(data)

      this.invoiceItems = data.invoiceItems
      this.invoiceDetail.patchValue({
        description: data.description,
        dateOfIssue: data.dateOfIssue,
        firstName: data.customer.firstName,
        lastName: data.customer.lastName,
        email: data.customer.email,
      });
    })
  }

  public onSubmit() {
    console.log(this.invoiceDetail, this.invoiceItems)
  }

  public onUpdateInvoiceItemFormValue(event: InvoiceItem) {
    this.invoiceItems = this.invoiceItems.map(item => {
      if (item.id === event.id) {
        return {
          ...item,
          name: event.name,
          numberOfItems: event.numberOfItems,
          unitPrice: event.unitPrice
        };
      }
      return item;
    })
  }
}
