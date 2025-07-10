import { Component, OnInit } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Message } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { Router } from '@angular/router';
import { AgbComponent } from '../../footerCOMPONENTS/agb/agb.component';
import { ValidationQuestion } from '../../../app/shared/interfaces/validation-question';
import { VALIDATION_QUESTIONS } from '../../../app/shared/variables/validation-questions';
import { getMessageObject } from '../../../app/shared/variables/message-vars';
import { LoginAndMessageResponse, RegisterCredentials } from '../../../app/shared/interfaces/login';
import { ROUTES_LIST } from '../../../app/shared/variables/routes-list';
import { UC_NavigateToStartPage } from '../../../app/core/use-cases/navigation/navigate-to-start-page.use-case';
import { UC_RegisterAccount } from '../../../app/core/use-cases/user/register-account.use-case';
import { UC_IsValidUserName } from '../../../app/core/use-cases/security/check-valid-user-name.use-case';
import { UC_GetInvalidChars } from '../../../app/core/use-cases/security/get-invalid-chars.use-case';

@Component({
    selector: 'app-register',
    imports: [
        FloatLabel,
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        Message,
        DialogModule,
        SelectModule,
        CheckboxModule,
        AgbComponent,
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    providers: [UC_NavigateToStartPage, UC_IsValidUserName, UC_GetInvalidChars, UC_RegisterAccount]
})
export class RegisterComponent implements OnInit {
    registerGroup!: FormGroup;
    isFormSubmitted: boolean = false;
    isDialogVisible: boolean = false;
    public isAGBDialogVisible: boolean = false;

    public questionList: ValidationQuestion[] = VALIDATION_QUESTIONS.map(
        (question) => ({
            name: question,
            code: question,
        })
    );
    private userName: string = '';

    constructor(
        public navigateToStartPageUseCase: UC_NavigateToStartPage,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private router: Router,
        private registerAccountUseCase: UC_RegisterAccount,
        private isValidUserNameUseCase: UC_IsValidUserName,
        private invalidCharsUseCase: UC_GetInvalidChars
    ) { }

    ngOnInit(): void {
        this.registerGroup = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
            validationQuestion: [null, [Validators.required]],
            validationAnswer: ['', [Validators.required]],
            agbAccept: [false, Validators.requiredTrue],
        });
    }

    registerUser = () => {
        this.isFormSubmitted = true;

        if (this.registerGroup.invalid) {
            return;
        }

        if (
            this.registerGroup.get('password')?.value !==
            this.registerGroup.get('passwordConfirm')?.value
        ) {
            this.showDialog();
            return;
        }

        this.userName = this.registerGroup.get('username')?.value;

        if (!this.isValidUserNameUseCase.execute(this.userName)) {
            this.messageService.add(
                getMessageObject(
                    'error',
                    'Ungültiger Nutzername',
                    `Nutzernamen dürfen keines der folgenden Zeichen enthalten: ${this.invalidCharsUseCase.observe().join(
                        ', '
                    )}`
                )
            );
            return;
        }

        const registerData: RegisterCredentials = {
            username: this.registerGroup.get('username')?.value,
            password: this.registerGroup.get('password')?.value,
            security_question:
                this.registerGroup.get('validationQuestion')?.value.name,
            security_answer: this.registerGroup.get('validationAnswer')?.value,
            terms_accepted: true,
        };

        this.registerAccountUseCase.execute(registerData).subscribe({
            next: (res: LoginAndMessageResponse) => {
                this.messageService.add(
                    getMessageObject('success', 'Nutzer erfolgreich angelegt.')
                );

                // navigate user to login page
                this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
            },
            error: (err: any) => {
                if (err.status === 409 && err.error.error === 'User already exists') {
                    this.messageService.add(
                        getMessageObject(
                            'error',
                            'Nutzer existiert bereits',
                            'Bitte wähle einen anderen Namen'
                        )
                    );

                    return;
                }
                this.messageService.add(
                    getMessageObject(
                        'error',
                        'Fehler beim Registrieren',
                        'Bitte versuche es erneut.'
                    )
                );
            },
        });
    };

    hasError = (field: string): boolean => {
        const control = this.registerGroup.get(field);

        return (
            control! && (control.dirty || control.touched || this.isFormSubmitted)
        );
    };

    changeInput = () => {
        this.isFormSubmitted = false;
    };

    showDialog = () => {
        this.isDialogVisible = true;
    };

    public openAGBDialog = () => {
        this.isAGBDialogVisible = true;
    };
}
