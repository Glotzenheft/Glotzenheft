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
import { TracklistService } from '../../../service/tracklist/tracklist.service';
import { MediaService } from '../../../service/media/media.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { TRACK_LIST_STATUS_LIST } from '../../../shared/variables/tracklist';
import { RatingModule } from 'primeng/rating';
import { Observable } from 'rxjs';
import { UpdateTracklistRequest } from '../../../shared/interfaces/media-interfaces';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';
import { UserService } from '../../../service/user/user.service';

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
  ],
  templateUrl: './update-tracklist-form.component.html',
  styleUrl: './update-tracklist-form.component.css',
})
export class UpdateTracklistFormComponent implements OnInit {
  // input variables
  public inpSeasonTracklists: InputSignal<SeasonTracklist[]> =
    input.required<SeasonTracklist[]>();
  public inpTracklistSelectionForm: InputSignal<FormGroup<any>> =
    input.required<FormGroup<any>>();

  // output variables
  @Output() cancelTracklistEditing: EventEmitter<number> =
    new EventEmitter<number>();

  // other variables
  public updateTracklistForm!: FormGroup;
  public selectedFullTracklist: SeasonTracklist | null = null;
  public isFormSubmitted: boolean = false;
  public tracklistStatusOptions: { name: string; value: string }[] =
    TRACK_LIST_STATUS_LIST.map((status: string) => ({
      name: status,
      value: status,
    }));
  public updateResponseData$: Observable<any> | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private mediaService: MediaService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const selectedTracklistFull: SeasonTracklist[] =
      this.inpSeasonTracklists().filter((tracklist: SeasonTracklist) => {
        return (
          tracklist.id ===
          this.inpTracklistSelectionForm().get('selectedTracklist')?.value
            .tracklistId
        );
      });

    if (selectedTracklistFull.length !== 1) {
      this.messageService.add({
        life: 7000,
        severity: 'error',
        summary: 'Fehler beim Tracklist-Abruf',
        detail:
          'Es ist ein Fehler aufgetreten. Wir leiten Sie zurück zur Übersicht.',
      });

      this.cancelTracklistEditing.emit(0);
      return;
    }

    this.selectedFullTracklist = selectedTracklistFull[0];
    console.log('tracklist full:', selectedTracklistFull[0]);

    this.updateTracklistForm = this.formBuilder.group({
      tracklist_status: [
        {
          name: selectedTracklistFull[0].status,
          value: selectedTracklistFull[0].status,
        },
        Validators.required,
      ],
      tracklist_name: [
        selectedTracklistFull[0].tracklistName,
        Validators.required,
      ],
      tracklist_rating: [selectedTracklistFull[0].rating],
      tracklist_start_date: [
        selectedTracklistFull[0].startDate
          ? new Date(selectedTracklistFull[0].startDate)
          : null,
      ],
      tracklist_finish_date: [
        selectedTracklistFull[0].finishDate
          ? new Date(selectedTracklistFull[0].finishDate)
          : null,
      ],
    });
  }

  public submitForm = () => {
    this.isFormSubmitted = true;

    if (this.updateTracklistForm.invalid) {
      console.log('invalid');
      return;
    }

    if (!this.selectedFullTracklist) {
      console.log('fehler');
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

      console.log('start date if:', formattedStartDate);
    }

    if (this.updateTracklistForm.get('tracklist_finish_date')?.value) {
      formattedEndDate = new Date(
        this.updateTracklistForm.get('tracklist_finish_date')?.value
      )
        .toISOString()
        .split('T')[0];
      console.log('end date if', formattedEndDate);
    }

    const updateTracklistData: UpdateTracklistRequest = {
      tracklist_id: this.selectedFullTracklist.id,
      tracklist_status:
        this.updateTracklistForm.get('tracklist_status')?.value.name,
      tracklist_name: this.updateTracklistForm.get('tracklist_name')?.value,
      tracklist_rating: this.updateTracklistForm.get('tracklist_rating')?.value,
      tracklist_start_date: formattedStartDate,
      tracklist_finish_date: formattedEndDate,
    };

    console.log('updated tracklist:', updateTracklistData);

    this.updateResponseData$ =
      this.mediaService.updateTracklist(updateTracklistData);

    if (!this.updateResponseData$) {
      this.messageService.add({
        life: 7000,
        severity: 'error',
        summary: 'Fehler beim Speichern',
        detail:
          'Beim Speichern ist ein Fehler aufgetreten. Bitte probiere es noch einmal.',
      });
      return;
    }

    this.updateResponseData$.subscribe({
      next: (res) => {
        this.messageService.add({
          life: 7000,
          severity: 'success',
          summary: 'Erfolgreich gespeichert',
        });
      },
      error: (err) => {
        if (err.status === 401) {
          this.messageService.add({
            life: 7000,
            severity: 'error',
            summary: 'Ungültige Authentifizierung',
            detail:
              'Deine Daten sind ungültig. Bitte logge dich ein, um Zugriff zu erhalten.',
          });
          this.userService.logoutOfAccount();
          this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);

          return;
        }

        this.messageService.add({
          life: 7000,
          severity: 'error',
          summary: 'Fehler beim Speichern',
          detail:
            'Beim Speichern ist ein Fehler aufgetreten. Bitte probiere es erneut.',
        });
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
}
