import { HttpClient } from "@angular/common/http";
import { Injectable, Inject } from "@angular/core";
import * as moment from "moment";
import { tap } from "rxjs/operators";
import { API_BASE_URL_TOKEN } from "../app.tokens";

@Injectable()
export class AuthService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL_TOKEN) private apiBaseUrl: string
  ) {}

  public login(input: Omit<IUser, "id" | "firstName" | "lastName">) {
    const { email, password } = input;
    return this.http
      .post(`${this.apiBaseUrl}login`, { email, password })
      .pipe(tap((res: any) => this.setSession(res)));
  }

  public register(input: Omit<IUser, "id">) {
    return this.http
      .post(`${this.apiBaseUrl}register`, input)
      .pipe(tap((res: any) => this.setSession(res)));
  }

  private setSession(authResult: LoginResponse) {
    const expiresAt = moment().add(authResult.expiresIn, "second");

    localStorage.setItem("id_token", authResult.token!);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  public logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
    return (
      moment().isBefore(this.getExpiration()) &&
      localStorage.getItem("id_token")
    );
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  public getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    if (!expiration) {
      return null;
    }
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
