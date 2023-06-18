import { Component, Injector, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppComponentBase } from "src/shared/app-component-base";

interface MenuItems {
  path: string;
  label: string;
}

@Component({
  selector: "navbar",
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent extends AppComponentBase implements OnInit {
  menuItems: MenuItems[] = [
    {
      path: "home",
      label: "Domov",
    },
    {
      path: "invoices-list",
      label: "Správa faktur",
    },
  ];
  constructor(injector: Injector, private router: Router) {
    super(injector);
  }
  ngOnInit(): void {}

  logOut(): void {
    this.authService.logout();
    this.router.navigateByUrl("/account/login");
  }
}
