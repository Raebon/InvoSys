import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-invoice-add-edit',
  templateUrl: './invoice-add-edit.component.html',
  styleUrls: ['./invoice-add-edit.component.css']
})
export class InvoiceAddEditComponent implements OnInit {
  invoiceId: string | null = null
  title:string = "Vytvoření faktury"
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id');

    if(this.invoiceId){
      //Editace
      this.title = `Editace faktury - ${this.invoiceId}`
    }else{
      //Vytvoření
      this.title = "Vytvoření faktury"
    }
  }

}
