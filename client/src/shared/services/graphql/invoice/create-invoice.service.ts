import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { DocumentNode } from "graphql";

interface CreateInvoiceResponse {
  invoice: {
    addInvoice: IInvoice;
  };
}

@Injectable()
export class CreateInvoiceService {
  constructor(private apollo: Apollo) {}

  createInvoice(input: IInvoiceInput, mutation: DocumentNode) {
    const { inputCustomer, inputInvoiceItems, ...rest } = input;
    const payload = {
      ...rest,
      customer: inputCustomer,
      invoiceItems: inputInvoiceItems,
    };
    return this.apollo.mutate<CreateInvoiceResponse>({
      mutation: mutation,
      variables: {
        input: payload,
      },
    });
  }
}
