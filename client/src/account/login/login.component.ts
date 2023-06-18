import { Component, Injector, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { finalize } from "rxjs";
import { AppComponentBase } from "src/shared/app-component-base";

@Component({
  selector: "app-login",
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
    const input = this.form.value;
    if (input.email && input.password) {
      this.loading = true;
      this.authService
        .login(input)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(() => {
          this.router.navigateByUrl("/app/home");
        });
    }
  }
}
