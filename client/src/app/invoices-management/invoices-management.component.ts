import { Component, OnInit } from '@angular/core';
import { GraphqlService } from '../services/graphql.service';

@Component({
  selector: 'app-invoices-management',
  templateUrl: './invoices-management.component.html',
  styleUrls: ['./invoices-management.component.css']
})
export class InvoicesManagementComponent implements OnInit {

  constructor(private graphqlService: GraphqlService) { }

  ngOnInit(): void {
  }
}
