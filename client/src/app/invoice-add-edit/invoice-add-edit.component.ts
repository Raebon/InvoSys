import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GraphqlService } from '../services/graphql.service';
import { FormControl, FormGroup } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

@Component({
  selector: 'app-invoice-add-edit',
  templateUrl: './invoice-add-edit.component.html',
  styleUrls: ['./invoice-add-edit.component.css'],
})
export class InvoiceAddEditComponent implements OnInit {
  invoiceId: string | null = null;

  currentDate: Date = new Date();

  invoiceDetail = new FormGroup({
    description: new FormControl(''),
    dateOfIssue: new FormControl<Date | undefined>(
      format(this.currentDate, 'yyyy-MM-dd') as any
    ),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });

  invoiceItems: InvoiceItem[] = [
    {
      id: uuidv4(),
      invoiceId: '',
      name: '',
      numberOfItems: 0,
      unitPrice: 0,
    },
  ];

  title: string = 'Vytvoření faktury';
  buttonLabel: string = 'Vytvořit';
  constructor(
    private route: ActivatedRoute,
    private graphqlService: GraphqlService
  ) {
    this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  }

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id');

    if (this.invoiceId) {
      //Editace
      this.title = `Editace faktury - ${this.invoiceId}`;
      this.buttonLabel = 'Editace';
      this.getInvoiceByIdDataToFormIfEdit(this.invoiceId);
    } else {
      //Vytvoření
      this.title = 'Vytvoření faktury';
      this.buttonLabel = 'Vytvořit';
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
    console.log(this.invoiceDetail, this.invoiceItems);
  }

  public onUpdateInvoiceItemFormValue(event: InvoiceItem): void {
    this.invoiceItems = this.invoiceItems.map((item) => {
      if (item.id === event.id) {
        return {
          ...item,
          name: event.name,
          numberOfItems: event.numberOfItems,
          unitPrice: event.unitPrice,
        };
      }
      return item;
    });
  }

  public onDeleteInvoiceItem(invoiceItemId: string): void {
    const selectedInvoiceItemIndex = this.invoiceItems.findIndex(
      (item) => item.id === invoiceItemId
    );

    if (selectedInvoiceItemIndex !== -1) {
      this.invoiceItems.splice(selectedInvoiceItemIndex, 1);
    }
  }

  public onAddInvoiceItem(): void {
    this.invoiceItems = [
      ...this.invoiceItems,
      {
        id: uuidv4(),
        invoiceId: this.invoiceId ?? '',
        name: '',
        numberOfItems: 0,
        unitPrice: 0,
      },
    ];
  }
}
