import { Component, OnInit, Injector } from "@angular/core";
import { AppComponentBase } from "src/shared/app-component-base";
import { GET_LAST_THREE_MONTHS_REVENUE } from "./getLastThreeMonthsRevenue.data";

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
    this.invoiceServices
      .getLastThreeMonthsRevenue(GET_LAST_THREE_MONTHS_REVENUE)
      .subscribe((data) => {
        this.revenueStats = data;
      });
  }
}
