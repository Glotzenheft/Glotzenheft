import { Component, OnInit } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { NavigationService } from '../../../service/navigation/navigation.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../service/user/user.service';
import { Message } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { SecurityService } from '../../../service/security/security.service';
import { PanelModule } from 'primeng/panel';
import { Router } from '@angular/router';
import { ERR_OBJECT_INVALID_AUTHENTICATION, getMessageObject } from '../../../app/shared/variables/message-vars';
import { LoginAndMessageResponse, LoginCredentials } from '../../../app/shared/interfaces/login';
import { ROUTES_LIST } from '../../../app/shared/variables/routes-list';

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
    public navigationService: NavigationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private securityService: SecurityService,
    private router: Router
  ) {}

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

    if (!this.userService.isUserLoginValid()) {
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
      !this.securityService.isValidUsername(
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

    this.userService.increaseLoginTries();

    this.userService.loginIntoAccount(loginData).subscribe({
      next: (res: LoginAndMessageResponse) => {
        localStorage.clear();
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', this.userName);
        this.navigationService.navigateToUserStart();
      },
      error: (err) => {
        if (err.status === 401) {
          this.userService.logoutOfAccount();

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
