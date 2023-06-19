import { Component, Injector, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { finalize } from "rxjs";
import { AppComponentBase } from "src/shared/app-component-base";

@Component({
  selector: "account-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent extends AppComponentBase implements OnInit {
  registerForm: FormGroup;
  loading: boolean;
  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private router: Router,
    private location: Location
  ) {
    super(injector);
    this.registerForm = this.fb.group(
      {
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        email: ["", Validators.required],
        password: ["", Validators.required],
        confirmPassword: ["", Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
    this.loading = false;
  }

  ngOnInit(): void {}

  public register(): void {
    const { confirmPassword, ...payload } = this.registerForm.value;
    const { firstName, lastName, password, email } = payload;

    if (firstName && lastName && password && email) {
      this.authService
        .register(payload)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe((res) => {
          this.graphqlService.invalidateCache();
          this.router.navigateByUrl("/app/home");
        });
    }
  }

  public goBack(): void {
    this.location.back();
  }

  public passwordMatchValidator(form: FormGroup) {
    const password = form.get("password")?.value;
    const confirmPassword = form.get("confirmPassword")?.value;

    if (password === confirmPassword) {
      return null;
    } else {
      return { mismatch: true };
    }
  }
}
