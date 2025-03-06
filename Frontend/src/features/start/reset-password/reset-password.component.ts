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
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';
import {
  ERR_OBJECT_INVALID_AUTHENTICATION,
  getMessageObject,
} from '../../../shared/variables/message-vars';

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
  public resetPasswordData$: Observable<any> | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    public navigationService: NavigationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetPasswordGroup = this.formBuilder.group({
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

    const newPasswordData: ResetPasswordCredentials = {
      security_question:
        this.resetPasswordGroup.get('validationQuestion')?.value.name,
      security_answer: this.resetPasswordGroup.get('validationAnswer')?.value,
      new_password: this.resetPasswordGroup.get('newPassword')?.value,
    };

    this.resetPasswordData$ = this.userService.resetPassword(newPasswordData);

    if (!this.resetPasswordData$) {
      this.messageService.add(
        getMessageObject(
          'error',
          'Fehler beim Ändern des Passwortes',
          'Bitte versuche es erneut.'
        )
      );
      return;
    }

    this.resetPasswordData$.subscribe({
      next: () => {
        this.messageService.add(
          getMessageObject(
            'success',
            'Passwort erfolgreich geändert',
            'Ihr Passwort wurde erfolgreich geändert. Sie können sich nun mit diesem anmelden. Sie werden automatisch ausgeloggt'
          )
        );

        this.userService.logoutOfAccount();
        this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
      },
      error: (err) => {
        if (err.status === 401) {
          this.userService.logoutOfAccount();
          this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
          this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
          return;
        }

        this.messageService.add(
          getMessageObject(
            'error',
            'Fehler beim Ändern des Passwortes',
            'Bitte versuche es erneut.'
          )
        );
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
