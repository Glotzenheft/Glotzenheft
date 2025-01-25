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
  isUserNameValid: boolean = true;
  isPasswordValid: boolean = true;

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
    if (this.loginGroup.invalid) {
      this.isUserNameValid = this.loginGroup.get('username')?.invalid
        ? false
        : true;
      this.isPasswordValid = this.loginGroup.get('password')?.invalid
        ? false
        : true;
      console.log('daa');
    }

    this.isUserNameValid = true;
    this.isPasswordValid = true;

    const loginData: LoginCredentials = {
      username: this.loginGroup.get('username')?.value,
      password: this.loginGroup.get('password')?.value,
    };

    this.userService.loginIntoAccount(loginData);
  };

  changeInput = (inputName: string) => {
    console.log(inputName);
    if (inputName === 'username') {
      this.isUserNameValid = true;
    }
  };
}
