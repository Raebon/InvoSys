import { Component, OnInit } from '@angular/core';
import { GraphqlService } from '../services/graphql.service';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css']
})
export class InvoicesListComponent implements OnInit {

  constructor(private graphqlService: GraphqlService) { }

  ngOnInit(): void {
    this.getInvoicesData()
  }

  public getInvoicesData(): void {
    this.graphqlService.getInvoices().subscribe(data => {
      console.log(data)
    })
  }

}
