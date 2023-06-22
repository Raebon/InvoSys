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
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-invoices-row-actions",
  templateUrl: "./invoices-row-actions.component.html",
})
export class InvoicesRowActionsComponent
  extends AppComponentBase
  implements OnInit
{
  @Input() item!: Invoice;
  @Output() onDeleteItem = new EventEmitter<string>();

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {}

  public calculateTotalPrice(invoiceItems: InvoiceItem[]): number {
    let totalPrice = 0;
    invoiceItems.forEach((item) => {
      totalPrice += item.numberOfItems * item.unitPrice;
    });

    return totalPrice;
  }

  public generatePDF() {
    const documentDefinition: any = {
      content: [
        {
          columns: [
            {
              image:
                "data:image/png;base64,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",
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
                        text: `${this.item.id}`,
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
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
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
            widths: ["*", 120, 120],
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
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
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
        //font: 'Quicksand',
      },
    };

    pdfMake.createPdf(documentDefinition).open();
    //.download(`faktura_${this.item.id}`);
  }

  public deleteInvoice(invoiceId: string): void {
    if (window.confirm(`Opravdu chcete odstranit fakturu?`)) {
      try {
        this.graphqlService.deleteInvoice(invoiceId).subscribe((data) => {
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

  private generateInvoiceItemsRows(items: InvoiceItem[]) {
    let rows: any[][] = [
      [
        {
          text: "Popis",
          fillColor: "#eaf2f5",
          border: [false, true, false, true],
          margin: [0, 5, 0, 5],
          textTransform: "uppercase",
        },
        {
          text: "Cena za jednotku",
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
      let array = [
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
}
