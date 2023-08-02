import { Injectable } from "@angular/core";
import { Apollo, QueryRef } from "apollo-angular";
import { DocumentNode } from "graphql";

interface SearchCustomersResponse {
  customer: {
    searchCustomers: ICustomerResult;
  };
}

@Injectable()
export class SearchCustomersService {
  constructor(private apollo: Apollo) {}

  searchCustomers(
    text: string = "",
    query: DocumentNode
  ): QueryRef<SearchCustomersResponse> {
    return this.apollo.watchQuery<SearchCustomersResponse>({
      query: query,
      variables: {
        text,
      },
      fetchPolicy: "network-only",
    });
  }
}
