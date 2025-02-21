import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { MediaService } from '../../../service/media/media.service';
import { SeasonTracklist } from '../../../shared/interfaces/tracklist-interfaces';
import {
  Film,
  UpdateTracklistRequest,
} from '../../../shared/interfaces/media-interfaces';
import { Observable } from 'rxjs';
import { TRACK_LIST_STATUS_LIST } from '../../../shared/variables/tracklist';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';
import { UserService } from '../../../service/user/user.service';
import { TracklistService } from '../../../service/tracklist/tracklist.service';

@Component({
  selector: 'app-update-film-tracklist',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    CommonModule,
    MessageModule,
    ButtonModule,
    FloatLabelModule,
    SelectModule,
    RatingModule,
    DatePickerModule,
  ],
  templateUrl: './update-film-tracklist.component.html',
  styleUrl: './update-film-tracklist.component.css',
})
export class UpdateFilmTracklistComponent implements OnInit {
  // input variables
  public inpTracklist: InputSignal<SeasonTracklist> =
    input.required<SeasonTracklist>();
  public inpFilmData: InputSignal<Film> = input.required<Film>();

  // output variables
  @Output() cancelTracklistForm: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() refreshFilmPage: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  // other variables
  public updateTracklistForm!: FormGroup;
  public isTracklistSubmitted: boolean = false;
  public updateResponseData$: Observable<any> | null = null;
  public tracklistStatusOptions: { name: string; value: string }[] =
    TRACK_LIST_STATUS_LIST.map((status: string) => ({
      name: status,
      value: status,
    }));

  constructor(
    private messageService: MessageService,
    private router: Router,
    private mediaService: MediaService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private tracklistService: TracklistService
  ) {}

  ngOnInit(): void {
    this.updateTracklistForm = this.formBuilder.group({
      tracklist_status: [
        {
          name: this.inpTracklist().status,
          value: this.inpTracklist().status,
        },
        Validators.required,
      ],
      tracklist_name: [this.inpTracklist().tracklistName, Validators.required],
      tracklist_rating: [this.inpTracklist().rating],
      tracklist_start_date: [
        this.inpTracklist().startDate !== null
          ? new Date(this.inpTracklist().startDate!)
          : null,
      ],
      tracklist_finish_date: [
        this.inpTracklist().finishDate
          ? new Date(this.inpTracklist().finishDate!)
          : null,
      ],
    });
  }

  public submitForm = () => {
    this.isTracklistSubmitted = true;

    if (this.updateTracklistForm.invalid) {
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
      tracklist_id: this.inpTracklist().id,
      tracklist_status:
        this.updateTracklistForm.get('tracklist_status')?.value.name,
      tracklist_name: this.updateTracklistForm.get('tracklist_name')?.value,
      tracklist_rating: this.updateTracklistForm.get('tracklist_rating')?.value,
      tracklist_start_date: formattedStartDate,
      tracklist_finish_date: formattedEndDate,
    };

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

        this.refreshFilmPage.emit(true);
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
      (fieldControl!.dirty ||
        fieldControl!.touched ||
        this.isTracklistSubmitted)
    );
  };

  public cancelTracklist = () => {
    this.cancelTracklistForm.emit(0);
  };
}
