import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class AccountRouteGuard {
  constructor(private _router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedIn()) {
      this._router.navigate([this.selectBestRoute()]);
      return false;
    }
    return true;
  }

  selectBestRoute(): string {
    return "/app/home";
  }
}
