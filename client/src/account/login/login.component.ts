import { Component, Injector, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { finalize } from "rxjs";
import { AppComponentBase } from "src/shared/app-component-base";

@Component({
  selector: "account-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent extends AppComponentBase implements OnInit {
  form: FormGroup;
  loading: boolean;
  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private router: Router
  ) {
    super(injector);
    this.form = this.fb.group({
      email: ["test@test.cz", Validators.required],
      password: ["123qwe", Validators.required],
    });
    this.loading = false;
  }

  ngOnInit(): void {}

  login() {
    const payload = this.form.value;
    if (payload.email && payload.password) {
      this.loading = true;
      this.authService
        .login(payload)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(() => {
          this.graphqlService.invalidateCache();
          this.router.navigateByUrl("/app/home");
        });
    }
  }
}
