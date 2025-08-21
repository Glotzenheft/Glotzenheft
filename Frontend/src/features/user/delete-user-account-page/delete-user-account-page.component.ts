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
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DeleteUserRequest } from '../../../shared/interfaces/user-interfaces';
import { Observable } from 'rxjs';
import { DeleteDialogComponent } from '../../sharedCOMPONENTS/delete-dialog/delete-dialog.component';
import { VALIDATION_QUESTIONS } from '../../../app/shared/variables/validation-questions';
import { ERR_OBJECT_INVALID_AUTHENTICATION, getMessageObject } from '../../../app/shared/variables/message-vars';
import { ROUTES_LIST } from '../../../app/shared/variables/routes-list';
import { UC_DeleteUserAccount } from '../../../app/core/use-cases/user/delete-user-account.use-case';
import { UC_LogoutOfAccount } from '../../../app/core/use-cases/user/log-out-of-account.use-case';

@Component({
    selector: 'app-delete-user-account-page',
    imports: [
        ButtonModule,
        MessageModule,
        ToastModule,
        InputTextModule,
        SelectModule,
        ReactiveFormsModule,
        FloatLabelModule,
        DeleteDialogComponent,
    ],
    templateUrl: './delete-user-account-page.component.html',
    styleUrl: './delete-user-account-page.component.css',
    providers: [UC_DeleteUserAccount, UC_LogoutOfAccount]
})
export class DeleteUserAccountPageComponent implements OnInit {
    // variables for form submitting
    public deleteUserForm!: FormGroup;
    public isFormSubmitted: boolean = false;
    public validationQuestions: { name: string; value: string }[] =
        VALIDATION_QUESTIONS.map((question: string) => ({
            name: question,
            value: question,
        }));
    public deleteUserAccountData$: Observable<any> | null = null;
    public isDeleteDialogVisible: boolean = false;

    constructor(
        private messageService: MessageService,
        private router: Router,
        private formBuilder: FormBuilder,
        private deleteUserAccountUseCase: UC_DeleteUserAccount,
        private logoutOfAccountUseCase: UC_LogoutOfAccount
    ) { }

    ngOnInit(): void {
        this.deleteUserForm = this.formBuilder.group({
            security_question: ['', Validators.required],
            security_answer: ['', Validators.required],
        });
    }

    public submitForm = () => {
        this.isFormSubmitted = true;

        if (this.deleteUserForm.invalid) {
            return;
        }

        const deleteUserData: DeleteUserRequest = {
            security_question:
                this.deleteUserForm.get('security_question')?.value.name,
            security_answer: this.deleteUserForm.get('security_answer')?.value,
        };

        this.deleteUserAccountData$ =
            this.deleteUserAccountUseCase.execute(deleteUserData);

        if (!this.deleteUserAccountData$) {
            this.messageService.add(
                getMessageObject(
                    'error',
                    'Fehler beim Löschen des Accounts',
                    'Beim Löschen des Account ist ein Fehler aufgetreten. Bitte probiere es erneut.'
                )
            );
            return;
        }

        this.deleteUserAccountData$.subscribe({
            next: (res) => {
                this.messageService.add(
                    getMessageObject(
                        'success',
                        'Account erfolgreich gelöscht',
                        'Du wirst nun ausgeloggt.'
                    )
                );
                this.logoutOfAccountUseCase.execute();
                this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
            },
            error: (err: any) => {
                if (err.status === 401) {
                    this.logoutOfAccountUseCase.execute();
                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                    return;
                }

                this.messageService.add(
                    getMessageObject(
                        'error',
                        'Fehler beim Löschen des Accounts',
                        'Beim Löschen ist ein Fehler aufgetreten. Bitte probiere es erneut.'
                    )
                );
            },
        });
    };

    public hasErrorField = (fieldName: string): boolean => {
        const fieldControl = this.deleteUserForm.get(fieldName);

        return (
            fieldControl! &&
            (fieldControl!.dirty || fieldControl!.touched || this.isFormSubmitted)
        );
    };

    public cancelDeletion = () => {
        this.router.navigateByUrl(ROUTES_LIST[8].fullUrl);
    };

    public setDialogStatus = (status: boolean) => {
        this.isDeleteDialogVisible = status;
    };
}
