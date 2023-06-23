import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { utils, writeFileXLSX } from "xlsx";

interface InvoiceExportData {
  id: string;
  datum_vystaveni: Date;
  popis: string;
  zakaznik: string;
  celkova_cena: number;
}

@Component({
  selector: "app-invoices-grid-actions",
  templateUrl: "./invoices-grid-actions.component.html",
})
export class InvoicesGridActionsComponent implements OnInit {
  @Input() excelExportData!: IInvoice[];
  @Output() searchOutput = new EventEmitter<string>();

  filterText = new FormControl("");
  constructor() {}

  ngOnInit(): void {}

  search(): void {
    this.searchOutput.emit(this.filterText.value ?? "");
  }

  excelExport(): void {
    let exportData: InvoiceExportData[] = [];
    this.excelExportData.map((item) => {
      let totalPrice = 0;
      item.invoiceItems.forEach(
        (item) => (totalPrice += item.numberOfItems * item.unitPrice)
      );

      let object: InvoiceExportData = {
        id: item.id,
        datum_vystaveni: item.dateOfIssue,
        popis: item.description,
        zakaznik: `${item.customer.firstName} ${item.customer.lastName}`,
        celkova_cena: totalPrice,
      };
      exportData.push(object);
    });

    let workBook = utils.book_new();
    let workSheet = utils.json_to_sheet(exportData);
    workBook.SheetNames.push("Export_data");
    workBook.Sheets["Export_data"] = workSheet;
    writeFileXLSX(workBook, "export_invoices.xlsx");
  }
}
