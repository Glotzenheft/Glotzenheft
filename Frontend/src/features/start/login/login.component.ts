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
import {
  LoginAndMessageResponse,
  LoginCredentials,
} from '../../../shared/interfaces/login';
import { Message } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { SecurityService } from '../../../service/security/security.service';
import { PanelModule } from 'primeng/panel';

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
    private securityService: SecurityService
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

    this.userName = this.loginGroup.get('username')?.value;

    if (
      !this.securityService.isValidUsername(
        this.loginGroup.get('username')?.value
      )
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ungültiger Nutzername',
      });
      return;
    }

    const loginData: LoginCredentials = {
      username: this.loginGroup.get('username')?.value,
      password: this.loginGroup.get('password')?.value,
    };

    this.userService.loginIntoAccount(loginData).subscribe({
      next: (res: LoginAndMessageResponse) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', this.userName);
        this.navigationService.navigateToUserStart();
      },
      error: () => {
        this.hasLoginError = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Loginversuch fehlgeschlagen',
          detail:
            'Die eingegebenen Nutzerdaten (Nutername oder Passwort) sind fehlerhaft. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.',
        });
      },
    });
  };

  hasError = (field: string, error: string): boolean => {
    const control = this.loginGroup.get(field);

    return (
      control! && (control.dirty || control.touched || this.isFormSubmitted)
    );
  };

  changeInput = () => {
    this.isFormSubmitted = false;
  };
}
