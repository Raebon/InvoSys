import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { DocumentNode } from "graphql";

interface UpdateInvoiceResponse {
  invoice: {
    updateInvoice: IInvoice;
  };
}

@Injectable()
export class UpdateInvoiceService {
  constructor(private apollo: Apollo) {}

  updateInvoice(invoiceInput: IInvoiceInput, mutation: DocumentNode) {
    const { inputCustomer, inputInvoiceItems, variableNumber, ...rest } =
      invoiceInput;
    const input = {
      ...rest,
      variableNumber: Number(variableNumber),
      customer: inputCustomer,
      invoiceItems: inputInvoiceItems,
    };
    return this.apollo.mutate<UpdateInvoiceResponse>({
      mutation: mutation,
      variables: {
        input,
      },
    });
  }
}
