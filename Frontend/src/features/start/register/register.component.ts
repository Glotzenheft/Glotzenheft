import { Component, OnInit } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { NavigationService } from '../../../service/navigation/navigation.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Message } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { UserService } from '../../../service/user/user.service';
import {
  LoginAndMessageResponse,
  RegisterCredentials,
} from '../../../shared/interfaces/login';
import { MessageService } from 'primeng/api';
import { SecurityService } from '../../../service/security/security.service';

@Component({
  selector: 'app-register',
  imports: [
    FloatLabel,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CommonModule,
    Message,
    DialogModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerGroup!: FormGroup;
  isFormSubmitted: boolean = false;
  isDialogVisible: boolean = false;
  private userName: string = '';

  constructor(
    public navigationService: NavigationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    this.registerGroup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
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

    if (!this.securityService.isValidUsername(this.userName)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ungültiger Nutzername',
        detail: `Nutzernamen dürfen keines der folgenden Zeichen aufweisen: ${this.securityService.INVALID_CHARS.join(
          ', '
        )}`,
      });
      return;
    }

    const registerData: RegisterCredentials = {
      username: this.registerGroup.get('username')?.value,
      password: this.registerGroup.get('password')?.value,
    };

    this.userService
      .registerAccount(registerData)
      .subscribe((res: LoginAndMessageResponse) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', this.userName);
      });
    this.navigationService.navigateToUserStart();
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
}
