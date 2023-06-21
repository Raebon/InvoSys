import {
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { AppComponentBase } from "src/shared/app-component-base";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from "html-to-pdfmake";

@Component({
  selector: "app-invoices-row-actions",
  templateUrl: "./invoices-row-actions.component.html",
})
export class InvoicesRowActionsComponent
  extends AppComponentBase
  implements OnInit
{
  @ViewChild("invoicePDF", { static: false }) invoicePDF!: ElementRef;

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
    const pdfQRCode = this.invoicePDF.nativeElement;
    const html = htmlToPdfmake(pdfQRCode.innerHTML);
    const documentDefinition = {
      content: [html],
    };

    pdfMake.createPdf(documentDefinition).download(`faktura_${this.item.id}`);
    //.open()
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
}
