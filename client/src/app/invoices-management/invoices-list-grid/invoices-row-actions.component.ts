import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { AppComponentBase } from "src/shared/app-component-base";
import { logo } from "./logo-image";
import { DELETE_INVOICE } from "./invoices-row-actions.data";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface InvoiceItemRowPDF {
  text: string;
  fillColor: string;
  border: boolean[];
  margin: number[];
  alignment?: string;
  textTransform?: string;
}

@Component({
  selector: "app-invoices-row-actions",
  templateUrl: "./invoices-row-actions.component.html",
})
export class InvoicesRowActionsComponent
  extends AppComponentBase
  implements OnInit
{
  @Input() item!: IInvoice;
  @Output() onDeleteItem = new EventEmitter<string>();

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {}

  public deleteInvoice(invoiceId: string): void {
    if (window.confirm(`Opravdu chcete odstranit fakturu?`)) {
      try {
        this.invoiceServices
          .deleteInvoice(invoiceId, DELETE_INVOICE)
          .subscribe((data) => {
            this.notifyService.showSuccess(
              "Faktura byla úspěšně odstraněna",
              "Úspěšná akce!"
            );
            this.onDeleteItem.emit(invoiceId);
          });
      } catch (error) {
        {
          this.notifyService.showError(
            "Faktura nebyla odstraněna",
            "Neúspěšná akce!"
          );
        }
      }
    }
  }

  public calculateTotalPrice(invoiceItems: IInvoiceItem[]): number {
    let totalPrice = 0;
    invoiceItems.forEach((item) => {
      totalPrice += item.numberOfItems * item.unitPrice;
    });

    return totalPrice;
  }

  private generateInvoiceItemsRows(items: IInvoiceItem[]) {
    let rows: InvoiceItemRowPDF[][] = [
      [
        {
          text: "",
          border: [false, true, false, true],
          alignment: "left",
          fillColor: "#eaf2f5",
          margin: [0, 5, 0, 5],
          textTransform: "uppercase",
        },
        {
          text: "",
          fillColor: "#eaf2f5",
          border: [false, true, false, true],
          margin: [0, 5, 0, 5],
          textTransform: "uppercase",
        },
        {
          text: "Cena za MJ",
          border: [false, true, false, true],
          alignment: "right",
          fillColor: "#eaf2f5",
          margin: [0, 5, 0, 5],
          textTransform: "uppercase",
        },
        {
          text: "Cena celkem",
          border: [false, true, false, true],
          alignment: "right",
          fillColor: "#eaf2f5",
          margin: [0, 5, 0, 5],
          textTransform: "uppercase",
        },
      ],
    ];
    items.forEach((item) => {
      let array: InvoiceItemRowPDF[] = [
        {
          border: [false, false, false, true],
          text: `${item.numberOfItems}`,
          fillColor: "#f5f5f5",
          alignment: "left",
          margin: [0, 5, 0, 5],
        },
        {
          text: `${item.name}`,
          border: [false, false, false, true],
          fillColor: "#f5f5f5",
          margin: [0, 5, 0, 5],
          alignment: "left",
        },
        {
          border: [false, false, false, true],
          text: `${item.unitPrice} Kč`,
          fillColor: "#f5f5f5",
          alignment: "right",
          margin: [0, 5, 0, 5],
        },
        {
          border: [false, false, false, true],
          text: `${item.unitPrice * item.numberOfItems} Kč`,
          fillColor: "#f5f5f5",
          alignment: "right",
          margin: [0, 5, 0, 5],
        },
      ];
      rows.push(array);
    });
    return rows;
  }

  public generatePDF() {
    const documentDefinition: any = {
      content: [
        {
          columns: [
            {
              image: logo,
              width: 125,
            },
            [
              {
                text: "Faktura",
                color: "#333333",
                width: "*",
                fontSize: 28,
                bold: true,
                alignment: "right",
                margin: [0, 0, 0, 15],
              },
              {
                stack: [
                  {
                    columns: [
                      {
                        text: "Variabilní symbol",
                        color: "#aaaaab",
                        bold: true,
                        width: "*",
                        fontSize: 12,
                        alignment: "right",
                      },
                      {
                        text: `${this.item.variableNumber}`,
                        bold: true,
                        color: "#333333",
                        fontSize: 12,
                        alignment: "right",
                        width: 100,
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: "Datum vystavení",
                        color: "#aaaaab",
                        bold: true,
                        width: "*",
                        fontSize: 12,
                        alignment: "right",
                      },
                      {
                        text: `${this.item.dateOfIssue}`,
                        bold: true,
                        color: "#333333",
                        fontSize: 12,
                        alignment: "right",
                        width: 100,
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: "Datum splatnosti",
                        color: "#aaaaab",
                        bold: true,
                        width: "*",
                        fontSize: 12,
                        alignment: "right",
                      },
                      {
                        text: `${this.item.dueDate}`,
                        bold: true,
                        color: "#333333",
                        fontSize: 12,
                        alignment: "right",
                        width: 100,
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: "Stav faktury",
                        color: "#aaaaab",
                        bold: true,
                        fontSize: 12,
                        alignment: "right",
                        width: "*",
                      },
                      {
                        text: "NEZAPLACENO",
                        bold: true,
                        fontSize: 14,
                        alignment: "right",
                        color: "red",
                        width: 100,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        {
          columns: [
            {
              text: "Dodavatel",
              color: "#aaaaab",
              bold: true,
              fontSize: 14,
              alignment: "left",
              margin: [0, 20, 0, 5],
            },
            {
              text: "Odběratel",
              color: "#aaaaab",
              bold: true,
              fontSize: 14,
              alignment: "left",
              margin: [0, 20, 0, 5],
            },
          ],
        },
        {
          columns: [
            {
              text: "info o přihlášeným uživ...",
              bold: true,
              color: "#333333",
              alignment: "left",
            },
            {
              text: `${this.item.customer.firstName} ${this.item.customer.lastName}`,
              bold: true,
              color: "#333333",
              alignment: "left",
            },
          ],
        },
        {
          columns: [
            {
              text: "Adresa",
              color: "#aaaaab",
              bold: true,
              margin: [0, 7, 0, 3],
            },
            {
              text: "Adresa",
              color: "#aaaaab",
              bold: true,
              margin: [0, 7, 0, 3],
            },
          ],
        },
        {
          columns: [
            {
              text: "626 13 Test adresy \n Brno \n   Česká Republika",
              style: "invoiceBillingAddress",
            },
            {
              text: "616 13 Test adresy2 \n Brno \n   Česká Republika",
              style: "invoiceBillingAddress",
            },
          ],
        },
        "\n\n",
        {
          width: "100%",
          alignment: "center",
          text: "",
          bold: true,
          margin: [0, 10, 0, 10],
          fontSize: 15,
        },
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function () {
              return 1;
            },
            vLineWidth: function () {
              return 1;
            },
            hLineColor: function (i: number) {
              if (i === 1 || i === 0) {
                return "#bfdde8";
              }
              return "#eaeaea";
            },
            vLineColor: function () {
              return "#eaeaea";
            },
            hLineStyle: function () {
              return null;
            },
            paddingLeft: function () {
              return 10;
            },
            paddingRight: function () {
              return 10;
            },
            paddingTop: function () {
              return 2;
            },
            paddingBottom: function () {
              return 2;
            },
            fillColor: function () {
              return "#fff";
            },
          },
          table: {
            headerRows: 1,
            widths: [50, "*", 100, 100],
            body: this.generateInvoiceItemsRows(this.item.invoiceItems),
          },
        },
        "\n",
        "\n\n",
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function () {
              return 1;
            },
            vLineWidth: function () {
              return 1;
            },
            hLineColor: function () {
              return "#eaeaea";
            },
            vLineColor: function () {
              return "#eaeaea";
            },
            hLineStyle: function () {
              return null;
            },
            paddingLeft: function () {
              return 10;
            },
            paddingRight: function () {
              return 10;
            },
            paddingTop: function () {
              return 3;
            },
            paddingBottom: function () {
              return 3;
            },
            fillColor: function () {
              return "#fff";
            },
          },
          table: {
            headerRows: 1,
            widths: ["*", "auto"],
            body: [
              [
                {
                  text: "Cena celkem",
                  bold: true,
                  fontSize: 20,
                  alignment: "right",
                  border: [false, false, false, true],
                  margin: [0, 5, 0, 5],
                },
                {
                  text: `${this.calculateTotalPrice(
                    this.item.invoiceItems
                  )} Kč`,
                  bold: true,
                  fontSize: 20,
                  alignment: "right",
                  border: [false, false, false, true],
                  fillColor: "#f5f5f5",
                  margin: [0, 5, 0, 5],
                },
              ],
            ],
          },
        },
        "\n\n",
        {
          text: "Poznámka",
          style: "notesTitle",
        },
        {
          text: `${this.item.description}`,
          style: "notesText",
        },
      ],
      styles: {
        notesTitle: {
          fontSize: 10,
          bold: true,
          margin: [0, 50, 0, 3],
        },
        notesText: {
          fontSize: 10,
        },
      },
      defaultStyle: {
        columnGap: 20,
      },
    };

    pdfMake.createPdf(documentDefinition).download(`faktura_${this.item.id}`);
    //.open();
  }
}
