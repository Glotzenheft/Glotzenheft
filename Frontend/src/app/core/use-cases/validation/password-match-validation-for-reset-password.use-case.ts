import { Inject, Injectable } from "@angular/core";
import { I_ValidationRepository, IT_VALIDATION_REPOSITORY } from "../../interfaces/validation.repository";
import { AbstractControl, ValidationErrors } from "@angular/forms";

@Injectable()
export class UC_PasswordMatchValidationForResetPassword {
    constructor(@Inject(IT_VALIDATION_REPOSITORY) private readonly validationRepository: I_ValidationRepository) { }

    public execute = (control: AbstractControl): ValidationErrors | null => { return this.validationRepository.passwordMatchValidatorForResetPassword(control) }
}