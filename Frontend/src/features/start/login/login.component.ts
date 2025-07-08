import { Component, OnInit } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Message } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { Router } from '@angular/router';
import { ERR_OBJECT_INVALID_AUTHENTICATION, getMessageObject } from '../../../app/shared/variables/message-vars';
import { LoginAndMessageResponse, LoginCredentials } from '../../../app/shared/interfaces/login';
import { ROUTES_LIST } from '../../../app/shared/variables/routes-list';
import { UC_NavigateToUserStart } from '../../../app/core/use-cases/navigation/navigate-to-user-start.use-case';
import { UC_NavigateToStartPage } from '../../../app/core/use-cases/navigation/navigate-to-start-page.use-case';
import { UC_IsUserLoginValid } from '../../../app/core/use-cases/user/is-user-login-valid.use-case';
import { UC_IncreaseLoginTries } from '../../../app/core/use-cases/user/increase-login-tries.use-case';
import { UC_LoginIntoAccount } from '../../../app/core/use-cases/user/login-into-account.use-case';
import { UC_LogoutOfAccount } from '../../../app/core/use-cases/user/log-out-of-account.use-case';
import { UC_IsValidUserName } from '../../../app/core/use-cases/security/check-valid-user-name.use-case';

@Component({
    selector: 'app-login',
    imports: [
        FloatLabel,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        CommonModule,
        ReactiveFormsModule,
        Message,
        PanelModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
    loginGroup!: FormGroup;
    isFormSubmitted: boolean = false;
    private userName: string = '';
    public hasLoginError: boolean = false;
    public isInvalidUsername: boolean = false;

    constructor(
        public navigateToUserStartUseCase: UC_NavigateToUserStart,
        public navigateToStartPageUseCase: UC_NavigateToStartPage,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private router: Router,
        private isUserLoginValidUseCase: UC_IsUserLoginValid,
        private increaseLoginTriesUseCase: UC_IncreaseLoginTries,
        private loginIntoAccountUseCase: UC_LoginIntoAccount,
        private logoutOfAccount: UC_LogoutOfAccount,
        private isValidUserNameUseCase: UC_IsValidUserName
    ) { }

    ngOnInit(): void {
        this.loginGroup = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    loginUser = () => {
        this.isInvalidUsername = false;
        this.isFormSubmitted = true;
        if (this.loginGroup.invalid) {
            return;
        }

        if (!this.isUserLoginValidUseCase.execute()) {
            // user login is blocked

            this.messageService.add(
                getMessageObject(
                    'error',
                    'Ungültiger Loginversuch',
                    'Du hast zu viele Anmeldeversuche unternommen und kannst dich daher für eine Minute nicht anmelden.'
                )
            );
            return;
        }

        this.userName = this.loginGroup.get('username')?.value;

        if (
            !this.isValidUserNameUseCase.execute(
                this.loginGroup.get('username')?.value
            )
        ) {
            this.messageService.add(
                getMessageObject('error', 'Ungültiger Nutzername')
            );
            return;
        }

        const loginData: LoginCredentials = {
            username: this.loginGroup.get('username')?.value,
            password: this.loginGroup.get('password')?.value,
        };

        this.increaseLoginTriesUseCase.execute();

        this.loginIntoAccountUseCase.execute(loginData).subscribe({
            next: (res: LoginAndMessageResponse) => {
                localStorage.clear();
                localStorage.setItem('token', res.token);
                localStorage.setItem('username', this.userName);
                this.navigateToUserStartUseCase.execute();
            },
            error: (err) => {
                if (err.status === 401) {
                    this.logoutOfAccount.execute();

                    if (err.error.error === 'Invalid credentials') {
                        this.messageService.add(
                            getMessageObject(
                                'error',
                                'Fehlerhafte Daten',
                                'Wir haben keinen Nutzer mit diesen Daten gefunden. Bitte probiere es erneut.'
                            )
                        );
                    } else {
                        this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    }

                    this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);

                    return;
                }

                this.hasLoginError = true;
                this.messageService.add(
                    getMessageObject(
                        'error',
                        'Loginversuch fehlgeschlagen',
                        'Die eingegebenen Daten sind fehlerhaft. Bitte prüfe deine Eingaben und probiere es erneut.'
                    )
                );
            },
        });
    };

    hasError = (field: string): boolean => {
        const control = this.loginGroup.get(field);

        return (
            control! && (control.dirty || control.touched || this.isFormSubmitted)
        );
    };

    changeInput = () => {
        this.isFormSubmitted = false;
    };
}
