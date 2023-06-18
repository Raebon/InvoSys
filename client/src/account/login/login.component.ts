import { Component, Injector, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AppComponentBase } from "src/shared/app-component-base";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent extends AppComponentBase implements OnInit {
  form: FormGroup;
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
  }

  ngOnInit(): void {}

  login() {
    const input = this.form.value;

    if (input.email && input.password) {
      this.authService.login(input).subscribe(() => {
        this.router.navigateByUrl("/app/home");
      });
    }
  }
}
