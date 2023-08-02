import { Injectable } from "@angular/core";
import { Apollo, QueryRef } from "apollo-angular";
import { DocumentNode } from "graphql";

interface GetLastThreeMonthsRevenueResponse {
  invoice: {
    getRevenueLastThreeMonths: Array<RevenueLastThreeMonthsResult>;
  };
}

@Injectable()
export class GetLastThreeMonthsRevenueService {
  constructor(private apollo: Apollo) {}

  getLastThreeMonthsRevenue(
    query: DocumentNode
  ): QueryRef<GetLastThreeMonthsRevenueResponse> {
    return this.apollo.watchQuery<GetLastThreeMonthsRevenueResponse>({
      query: query,
      fetchPolicy: "network-only",
    });
  }
}
