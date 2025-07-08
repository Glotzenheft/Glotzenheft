import { InjectionToken } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";

export interface I_ValidationRepository {
    passwordMatchValidatorForResetPassword: (control: AbstractControl) => ValidationErrors | null
}

export const IT_VALIDATION_REPOSITORY = new InjectionToken<I_ValidationRepository>("I_ValidationRepository")