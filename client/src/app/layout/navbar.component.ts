import { Component, Injector, OnInit } from "@angular/core";

interface MenuItems {
  path: string;
  label: string;
}

@Component({
  selector: "navbar",
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent implements OnInit {
  menuItems: MenuItems[] = [
    {
      path: "/home",
      label: "Domov",
    },
    {
      path: "/invoices-list",
      label: "Správa faktur",
    },
  ];
  constructor(injector: Injector) {}
  ngOnInit(): void {}
}
