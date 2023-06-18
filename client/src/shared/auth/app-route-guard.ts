import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class AppRouteGuard implements CanActivate {
  constructor(private _router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedOut()) {
      this._router.navigate([this.selectBestRoute()]);
      return false;
    }
    return true;
  }

  selectBestRoute(): string {
    return "/account/login";
  }
}
