import { Component, OnInit } from "@angular/core";
import { GraphqlService } from "../../services/graphql.service";

@Component({
  selector: "app-revenue-last-three-months",
  templateUrl: "./revenue-last-three-months.component.html",
  styleUrls: ["./revenue-last-three-months.component.css"],
})
export class RevenueLastThreeMonthsComponent implements OnInit {
  revenueStats: RevenueLastThreeMonthsResult[] = [];

  constructor(private graphqlService: GraphqlService) {}

  ngOnInit(): void {
    this.getLastThreeMonthsRevenueData();
  }

  public getLastThreeMonthsRevenueData(): void {
    this.graphqlService.getLastThreeMonthsRevenue().subscribe((data) => {
      this.revenueStats = data;
    });
  }
}
