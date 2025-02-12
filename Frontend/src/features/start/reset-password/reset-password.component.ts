import { CommonModule } from '@angular/common';
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
import { ValidationQuestion } from '../../../shared/interfaces/validation-question';
import { VALIDATION_QUESTIONS } from '../../../shared/variables/validation-questions';
import { SecurityService } from '../../../service/security/security.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { NavigationService } from '../../../service/navigation/navigation.service';
import { ResetPasswordCredentials } from '../../../shared/interfaces/login';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../../service/user/user.service';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    FloatLabelModule,
    MessageModule,
    CommonModule,
    ButtonModule,
    PasswordModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordGroup!: FormGroup;
  public isFormSubmitted: boolean = false;
  public questionList: ValidationQuestion[] = VALIDATION_QUESTIONS.map(
    (question: string) => ({ name: question, code: question })
  );

  constructor(
    private formBuilder: FormBuilder,
    private securityService: SecurityService,
    private messageService: MessageService,
    private userService: UserService,
    public navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.resetPasswordGroup = this.formBuilder.group({
      username: ['', [Validators.required]],
      validationQuestion: [{ name: '', code: '' }, Validators.required],
      validationAnswer: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  public submitForm = () => {
    this.isFormSubmitted = true;

    if (this.resetPasswordGroup.invalid) {
      return;
    }

    if (
      !this.securityService.isValidUsername(
        this.resetPasswordGroup.get('username')?.value
      )
    ) {
      this.messageService.add({
        life: 7000,
        summary: 'Ungültiger Nutzername',
        detail: `Der Nutzername darf keines der folgenden Zeichen enthalten: ${this.securityService.INVALID_CHARS.join(
          ', '
        )}`,
      });
    }

    const newPasswordData: ResetPasswordCredentials = {
      username: this.resetPasswordGroup.get('username')?.value,
      validationQuestion:
        this.resetPasswordGroup.get('validationQuestion')?.value.name,
      validationAnswer: this.resetPasswordGroup.get('validationAnswer')?.value,
      newPassword: this.resetPasswordGroup.get('newPassword')?.value,
    };

    console.log(newPasswordData);

    this.userService.resetPassword(newPasswordData).subscribe({
      next: (res) => {
        this.messageService.add({
          life: 7000,
          summary: 'Passwort erfolgreich geändert',
          detail:
            'Ihr Passwort wurde erfolgreich geändert. Sie können sich nun mit diesem anmelden.',
          severity: 'success',
        });
      },
      error: () => {
        this.messageService.add({
          life: 7000,
          summary: 'Fehler beim Ändern des Passwortes',
          detail:
            'Beim Ändern Ihres Passwortes ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
          severity: 'error',
        });
      },
    });
  };

  public hasError = (field: string): boolean => {
    const control = this.resetPasswordGroup.get(field);

    return (
      control! && (control.dirty || control.touched || this.isFormSubmitted)
    );
  };
}
