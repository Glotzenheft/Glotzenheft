import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MediaService } from '../../../service/media/media.service';
import { UserService } from '../../../service/user/user.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { VALIDATION_QUESTIONS } from '../../../shared/variables/validation-questions';
import { DeleteUserRequest } from '../../../shared/interfaces/user-interfaces';
import { Observable } from 'rxjs';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-delete-user-account-page',
  imports: [
    CommonModule,
    ButtonModule,
    MessageModule,
    ToastModule,
    InputTextModule,
    SelectModule,
    ReactiveFormsModule,
    FloatLabelModule,
    DeleteDialogComponent,
  ],
  templateUrl: './delete-user-account-page.component.html',
  styleUrl: './delete-user-account-page.component.css',
})
export class DeleteUserAccountPageComponent implements OnInit {
  // variables for form submitting
  public deleteUserForm!: FormGroup;
  public isFormSubmitted: boolean = false;
  public validationQuestions: { name: string; value: string }[] =
    VALIDATION_QUESTIONS.map((question: string) => ({
      name: question,
      value: question,
    }));
  public deleteUserAccountData$: Observable<any> | null = null;
  public isDeleteDialogVisible: boolean = false;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private mediaService: MediaService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.deleteUserForm = this.formBuilder.group({
      security_question: ['', Validators.required],
      security_answer: ['', Validators.required],
    });
  }

  public submitForm = () => {
    this.isFormSubmitted = true;

    if (this.deleteUserForm.invalid) {
      this.messageService.add({
        life: 7000,
        severity: 'error',
        summary: 'Ungültige Eingaben',
        detail:
          'Die eingegebenen Daten sind ungültig. Bitte prüfe deine Eingaben und probiere es noch einmal.',
      });

      return;
    }

    const deleteUserData: DeleteUserRequest = {
      security_question:
        this.deleteUserForm.get('security_question')?.value.name,
      security_answer: this.deleteUserForm.get('security_answer')?.value,
    };

    this.deleteUserAccountData$ =
      this.userService.deleteUserAccount(deleteUserData);

    if (!this.deleteUserAccountData$) {
      this.messageService.add({
        life: 7000,
        severity: 'error',
        summary: 'Fehler beim Löschen des Accounts',
        detail:
          'Beim Löschen des Accounts ist ein Fehler aufgetreten. Bitte probiere es erneut.',
      });
      return;
    }

    this.deleteUserAccountData$.subscribe({
      next: (res) => {
        this.messageService.add({
          life: 7000,
          severity: 'success',
          summary: 'Account erfolgreich gelöscht',
          detail: 'Du wirst nun ausgeloggt und zum Login weitergeleitet.',
        });
        this.userService.logoutOfAccount();
        this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
      },
    });
  };

  public hasErrorField = (fieldName: string): boolean => {
    const fieldControl = this.deleteUserForm.get(fieldName);

    return (
      fieldControl! &&
      (fieldControl!.dirty || fieldControl!.touched || this.isFormSubmitted)
    );
  };

  public cancelDeletion = () => {
    this.router.navigateByUrl(ROUTES_LIST[8].fullUrl);
  };

  public setDialogStatus = (status: boolean) => {
    this.isDeleteDialogVisible = status;
  };
}
