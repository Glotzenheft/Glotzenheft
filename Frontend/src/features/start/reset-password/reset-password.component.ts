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
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ValidationQuestion } from '../../../app/shared/interfaces/validation-question';
import { VALIDATION_QUESTIONS } from '../../../app/shared/variables/validation-questions';
import { ResetPasswordCredentials } from '../../../app/shared/interfaces/login';
import {
    ERR_OBJECT_INVALID_AUTHENTICATION,
    getMessageObject,
} from '../../../app/shared/variables/message-vars';
import { ROUTES_LIST } from '../../../app/shared/variables/routes-list';
import { UC_ResetPassword } from '../../../app/core/use-cases/user/reset-password.use-case';
import { UC_LogoutOfAccount } from '../../../app/core/use-cases/user/log-out-of-account.use-case';
import { UC_PasswordMatchValidationForResetPassword } from '../../../app/core/use-cases/validation/password-match-validation-for-reset-password.use-case';
import { UC_NavigateToStartPage } from '../../../app/core/use-cases/navigation/navigate-to-start-page.use-case';

@Component({
    selector: 'app-reset-password',
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        SelectModule,
        FloatLabelModule,
        MessageModule,
        ButtonModule,
        PasswordModule,
    ],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.css',
    providers: [
        UC_NavigateToStartPage,
        UC_LogoutOfAccount,
        UC_ResetPassword,
        UC_PasswordMatchValidationForResetPassword,
    ],
})
export class ResetPasswordComponent implements OnInit {
    public resetPasswordGroup!: FormGroup;
    public isFormSubmitted: boolean = false;
    public questionList: ValidationQuestion[] = VALIDATION_QUESTIONS.map(
        (question: string) => ({ name: question, code: question }),
    );
    public resetPasswordData$: Observable<any> | null = null;

    constructor(
        public navigateToStartPageUseCase: UC_NavigateToStartPage,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private router: Router,
        private resetPasswordUseCase: UC_ResetPassword,
        private logoutOfAccountUseCase: UC_LogoutOfAccount,
        private validationPasswordsMatchUseCase: UC_PasswordMatchValidationForResetPassword,
    ) {}

    ngOnInit(): void {
        this.resetPasswordGroup = this.formBuilder.group(
            {
                validationQuestion: [null, Validators.required],
                validationAnswer: ['', Validators.required],
                newPassword: [
                    '',
                    [Validators.required, Validators.minLength(8)],
                ],
                repeatPassword: [
                    '',
                    [Validators.required, Validators.minLength(8)],
                ],
            },
            {
                validators: this.validationPasswordsMatchUseCase.execute,
            },
        );
    }

    public submitForm = () => {
        this.isFormSubmitted = true;

        if (this.resetPasswordGroup.invalid) {
            return;
        }

        const newPasswordData: ResetPasswordCredentials = {
            security_question:
                this.resetPasswordGroup.get('validationQuestion')?.value.name,
            security_answer:
                this.resetPasswordGroup.get('validationAnswer')?.value,
            new_password: this.resetPasswordGroup.get('newPassword')?.value,
        };

        this.resetPasswordData$ =
            this.resetPasswordUseCase.execute(newPasswordData);

        if (!this.resetPasswordData$) {
            this.messageService.add(
                getMessageObject(
                    'error',
                    'Fehler beim Ändern des Passwortes',
                    'Bitte versuche es erneut.',
                ),
            );
            return;
        }

        this.resetPasswordData$.subscribe({
            next: () => {
                this.messageService.add(
                    getMessageObject(
                        'success',
                        'Passwort erfolgreich geändert',
                        'Ihr Passwort wurde erfolgreich geändert. Sie können sich nun mit diesem anmelden. Sie werden automatisch ausgeloggt',
                    ),
                );

                this.logoutOfAccountUseCase.execute();
                this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
            },
            error: (err) => {
                if (err.status === 401) {
                    this.logoutOfAccountUseCase.execute();
                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                    return;
                }

                this.messageService.add(
                    getMessageObject(
                        'error',
                        'Fehler beim Ändern des Passwortes',
                        'Bitte versuche es erneut.',
                    ),
                );
            },
        });
    };

    public hasError = (field: string): boolean => {
        const control = this.resetPasswordGroup.get(field);

        return (
            control! &&
            (control.dirty || control.touched || this.isFormSubmitted)
        );
    };

    public passwordMismatch = (): boolean => {
        return this.resetPasswordGroup.hasError('passwordMismatch');
    };
}
