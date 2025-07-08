import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { I_ValidationRepository } from '../../core/interfaces/validation.repository';

@Injectable({
    providedIn: 'root',
})
export class R_Validation implements I_ValidationRepository {
    constructor() { }

    /**
     *Function as Validator for checking if two passwords are the same on the reset password page.
     * @param control AbstractControl
     * @returns ValidationErrors | null
     */
    public passwordMatchValidatorForResetPassword: ValidatorFn = (
        control: AbstractControl
    ): ValidationErrors | null => {
        const password = control.get('newPassword')?.value;
        const confirmPassword = control.get('repeatPassword')?.value;

        return password === confirmPassword ? null : { passwordMismatch: true };
    };
}
