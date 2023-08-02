import { Injectable } from "@angular/core";
import { Apollo, QueryRef } from "apollo-angular";
import { DocumentNode } from "graphql";

interface GetInvoiceByIdResponse {
  invoice: {
    getInvoiceById: IInvoice;
  };
}

@Injectable()
export class GetInvoiceByIdService {
  constructor(private apollo: Apollo) {}

  getInvoiceById(
    params: string,
    query: DocumentNode
  ): QueryRef<GetInvoiceByIdResponse> {
    return this.apollo.watchQuery<GetInvoiceByIdResponse>({
      query: query,
      variables: {
        getInvoiceByIdId: params,
      },
      fetchPolicy: "network-only",
    });
  }
}
