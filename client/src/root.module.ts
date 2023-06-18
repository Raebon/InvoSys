import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { GraphQLModule } from "./shared/graphql.module";
import { RootRoutingModule } from "./root-routing.module";
import { RootComponent } from "./root.component";
import { SharedModule } from "./shared/shared.module";
import { AuthInterceptor } from "./shared/auth/auth-interceptor";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule.forRoot(),
    GraphQLModule,
    RootRoutingModule,
    ToastrModule.forRoot(),
  ],
  declarations: [RootComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [RootComponent],
})
export class RootModule {}
