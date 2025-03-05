import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  OnInit,
  Output,
} from '@angular/core';
import { SeasonTracklist } from '../../../shared/interfaces/tracklist-interfaces';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MediaService } from '../../../service/media/media.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import {
  convertTracklistStatusIntoGerman,
  TRACK_LIST_STATUS_LIST,
} from '../../../shared/variables/tracklist';
import { RatingModule } from 'primeng/rating';
import { Observable } from 'rxjs';
import { UpdateTracklistRequest } from '../../../shared/interfaces/media-interfaces';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';
import { UserService } from '../../../service/user/user.service';
import {
  ERR_OBJECT_INVALID_AUTHENTICATION,
  getMessageObject,
} from '../../../shared/variables/message-vars';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-update-tracklist-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    MessageModule,
    SelectModule,
    FloatLabelModule,
    InputTextModule,
    DatePickerModule,
    RatingModule,
    DeleteDialogComponent,
  ],
  templateUrl: './update-tracklist-form.component.html',
  styleUrl: './update-tracklist-form.component.css',
})
export class UpdateTracklistFormComponent implements OnInit {
  // input variables

  public inpSelectedTracklist: InputSignal<SeasonTracklist> =
    input.required<SeasonTracklist>();

  // output variables
  @Output() cancelTracklistEditing: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() saveUpdatedTracklist: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  // other variables
  public updateTracklistForm!: FormGroup;
  public selectedFullTracklist: SeasonTracklist | null = null;
  public isFormSubmitted: boolean = false;
  public tracklistStatusOptions: { name: string; value: string }[] =
    TRACK_LIST_STATUS_LIST.map((status: string) => ({
      name: convertTracklistStatusIntoGerman(status),
      value: status,
    }));

  // request variables
  public updateResponseData$: Observable<any> | null = null;
  public deleteResponseData$: Observable<any> | null = null;

  public isDeleteDialogVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private mediaService: MediaService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadFilmData();

    console.log(this.inpSelectedTracklist().status);
  }

  public loadFilmData = () => {
    this.selectedFullTracklist = this.inpSelectedTracklist();

    this.updateTracklistForm = this.formBuilder.group({
      tracklist_status: [
        {
          name: convertTracklistStatusIntoGerman(
            this.inpSelectedTracklist().status
          ),
          value: this.inpSelectedTracklist().status,
        },
        Validators.required,
      ],
      tracklist_name: [
        this.inpSelectedTracklist().tracklistName,
        Validators.required,
      ],
      tracklist_rating: [this.inpSelectedTracklist().rating],
      tracklist_start_date: [
        this.inpSelectedTracklist().startDate
          ? new Date(this.inpSelectedTracklist().startDate!)
          : null,
      ],
      tracklist_finish_date: [
        this.inpSelectedTracklist().finishDate
          ? new Date(this.inpSelectedTracklist().finishDate!)
          : null,
      ],
    });
  };

  public submitForm = () => {
    this.isFormSubmitted = true;

    if (this.updateTracklistForm.invalid) {
      return;
    }

    if (!this.selectedFullTracklist) {
      return;
    }

    let formattedStartDate: string = '';
    let formattedEndDate: string = '';

    if (this.updateTracklistForm.get('tracklist_start_date')?.value) {
      formattedStartDate = new Date(
        this.updateTracklistForm.get('tracklist_start_date')?.value
      )
        .toISOString()
        .split('T')[0];
    }

    if (this.updateTracklistForm.get('tracklist_finish_date')?.value) {
      formattedEndDate = new Date(
        this.updateTracklistForm.get('tracklist_finish_date')?.value
      )
        .toISOString()
        .split('T')[0];
    }

    const updateTracklistData: UpdateTracklistRequest = {
      tracklist_id: this.selectedFullTracklist.id,
      tracklist_status:
        this.updateTracklistForm.get('tracklist_status')?.value.value,
      tracklist_name: this.updateTracklistForm.get('tracklist_name')?.value,
      tracklist_rating: this.updateTracklistForm.get('tracklist_rating')?.value,
      tracklist_start_date: formattedStartDate,
      tracklist_finish_date: formattedEndDate,
    };

    this.updateResponseData$ =
      this.mediaService.updateTracklist(updateTracklistData);

    if (!this.updateResponseData$) {
      this.messageService.add(
        getMessageObject(
          'error',
          'Fehler beim Speichern',
          'Bitte probiere es erneut.'
        )
      );
      return;
    }

    this.updateResponseData$.subscribe({
      next: (res) => {
        this.messageService.add(
          getMessageObject('success', 'Erfolgreich gespeichert.')
        );
        this.saveUpdatedTracklist.emit(true);
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
            'Fehler beim Speichern',
            'Bitte probiere es erneut.'
          )
        );
      },
    });
  };

  public hasErrorField = (field: string) => {
    const fieldControl = this.updateTracklistForm.get(field);

    return (
      fieldControl! &&
      (fieldControl!.dirty || fieldControl!.touched || this.isFormSubmitted)
    );
  };

  public cancelTracklist = () => {
    this.cancelTracklistEditing.emit(0);
  };

  public deleteTracklist = () => {
    this.isDeleteDialogVisible = false;

    this.deleteResponseData$ = this.mediaService.deleteTracklist(
      this.inpSelectedTracklist().id
    );

    if (!this.deleteResponseData$) {
      this.messageService.add(
        getMessageObject(
          'error',
          'Fehler beim Löschen der Trackliste',
          'Bitte probiere es erneut.'
        )
      );
      return;
    }

    this.deleteResponseData$.subscribe({
      next: () => {
        this.messageService.add(
          getMessageObject('success', 'Trackliste erfolgreich gelöscht')
        );
        this.saveUpdatedTracklist.emit(true);
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
            'Fehler beim Löschen',
            'Bitte probiere es erneut.'
          )
        );
      },
    });
  };

  public setDeleteDialogVisibility = (status: boolean) => {
    this.isDeleteDialogVisible = status;
  };
}
