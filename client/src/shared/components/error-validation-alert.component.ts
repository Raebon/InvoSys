import { Component, Input } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Component({
  selector: "app-error-validation-alert",
  templateUrl: "./error-validation-alert.component.html",
})
export class ErrorValidationAlertComponent {
  @Input() control!: AbstractControl<any | null> | null | undefined;

  constructor() {}

  ngOnInit(): void {}

  public getErrorText(): string {
    if (this.control!.errors?.["required"]) {
      return "Povinné pole.";
    }
    if (this.control!.errors?.["pattern"]) {
      return "Neplatný formát.";
    }
    if (this.control!.errors?.["minlength"]) {
      return "Toto pole nesplňuje minimální délku.";
    }
    return "";
  }
}
