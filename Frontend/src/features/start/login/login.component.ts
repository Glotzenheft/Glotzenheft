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
import { LoginCredentials } from '../../../shared/interfaces/login';
import { Message } from 'primeng/message';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginGroup!: FormGroup;
  isFormSubmitted: boolean = false;

  constructor(
    public navigationService: NavigationService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loginGroup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  loginUser = () => {
    this.isFormSubmitted = true;
    if (this.loginGroup.invalid) {
      return;
    }

    const loginData: LoginCredentials = {
      username: this.loginGroup.get('username')?.value,
      password: this.loginGroup.get('password')?.value,
    };

    console.log(loginData);

    this.userService.loginIntoAccount(loginData);
    this.navigationService.navigateToUserStart();
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
