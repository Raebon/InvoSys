import { Injectable } from "@angular/core";
import { Apollo, QueryRef } from "apollo-angular";
import { DocumentNode } from "graphql";

interface GetInvoicesResponse {
  invoice: {
    getInvoices: IInvoiceResult;
  };
}

@Injectable()
export class GetInvoicesService {
  constructor(private apollo: Apollo) {}

  getInvoices(
    params: IGetInvoicesBody,
    query: DocumentNode
  ): QueryRef<GetInvoicesResponse> {
    return this.apollo.watchQuery<GetInvoicesResponse>({
      query: query,
      variables: {
        body: params,
      },
      fetchPolicy: "network-only",
    });
  }
}
