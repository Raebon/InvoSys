import { Component, OnInit, Injector } from "@angular/core";
import { AppComponentBase } from "src/shared/app-component-base";

@Component({
  selector: "app-revenue-last-three-months",
  templateUrl: "./revenue-last-three-months.component.html",
  styleUrls: ["./revenue-last-three-months.component.css"],
})
export class RevenueLastThreeMonthsComponent
  extends AppComponentBase
  implements OnInit
{
  revenueStats: RevenueLastThreeMonthsResult[];

  constructor(injector: Injector) {
    super(injector);
    this.revenueStats = [];
  }

  ngOnInit(): void {
    this.getLastThreeMonthsRevenueData();
  }

  public getLastThreeMonthsRevenueData(): void {
    this.graphqlService.getLastThreeMonthsRevenue().subscribe((data) => {
      this.revenueStats = data;
    });
  }
}
