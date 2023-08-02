import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { DocumentNode } from "graphql";

interface IDeleteInvoiceResponse {
  invoice: {
    deleteInvoice: DeleteInvoiceResponse;
  };
}

@Injectable()
export class DeleteInvoiceService {
  constructor(private apollo: Apollo) {}

  deleteInvoice(input: string, mutation: DocumentNode) {
    return this.apollo.mutate<IDeleteInvoiceResponse>({
      mutation: mutation,
      variables: {
        input,
      },
    });
  }
}
