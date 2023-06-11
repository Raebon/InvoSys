import { Component, OnInit } from '@angular/core';
import { GraphqlService } from '../../services/graphql.service';

@Component({
  selector: 'app-revenue-last-three-months',
  templateUrl: './revenue-last-three-months.component.html',
  styleUrls: ['./revenue-last-three-months.component.css']
})
export class RevenueLastThreeMonthsComponent implements OnInit {

  revenueStats = [
    {
      month: "Červen",
      revenue: 75231
    },
    {
      month: "Květen",
      revenue: 251231
    },
    {
      month: "Březen",
      revenue: 65155
    },

  ]

  constructor(private graphqlService: GraphqlService) { }

  ngOnInit(): void {
  }

}
