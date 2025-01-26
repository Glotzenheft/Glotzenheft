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
import { RegisterCredentials } from '../../../shared/interfaces/login';

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

  constructor(
    public navigationService: NavigationService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.registerGroup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(8)]],
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

    const registerData: RegisterCredentials = {
      username: this.registerGroup.get('username')?.value,
      password: this.registerGroup.get('password')?.value,
    };

    console.log(registerData);
    this.userService.registerAccount(registerData);
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
