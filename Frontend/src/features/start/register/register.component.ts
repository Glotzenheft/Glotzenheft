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
import { VALIDATION_QUESTIONS } from '../../../shared/variables/validation-questions';
import { SelectModule } from 'primeng/select';
import { ValidationQuestion } from '../../../shared/interfaces/validation-question';
import { CheckboxModule } from 'primeng/checkbox';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';
import { getMessageObject } from '../../../shared/variables/message-vars';
import { AgbComponent } from '../../footerCOMPONENTS/agb/agb.component';

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
    SelectModule,
    CheckboxModule,
    AgbComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
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
    public navigationService: NavigationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private securityService: SecurityService,
    private router: Router
  ) {}

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

    if (!this.securityService.isValidUsername(this.userName)) {
      this.messageService.add(
        getMessageObject(
          'error',
          'Ungültiger Nutzername',
          `Nutzernamen dürfen keines der folgenden Zeichen enthalten: ${this.securityService.INVALID_CHARS.join(
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

    this.userService.registerAccount(registerData).subscribe({
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
