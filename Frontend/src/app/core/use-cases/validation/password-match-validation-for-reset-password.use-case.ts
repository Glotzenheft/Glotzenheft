/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this programm.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Inject, Injectable } from "@angular/core";
import { I_ValidationRepository, IT_VALIDATION_REPOSITORY } from "../../interfaces/validation.repository";
import { AbstractControl, ValidationErrors } from "@angular/forms";

@Injectable()
export class UC_PasswordMatchValidationForResetPassword {
    constructor(@Inject(IT_VALIDATION_REPOSITORY) private readonly validationRepository: I_ValidationRepository) { }

    public execute = (control: AbstractControl): ValidationErrors | null => { return this.validationRepository.passwordMatchValidatorForResetPassword(control) }
}