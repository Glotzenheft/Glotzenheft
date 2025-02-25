import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  OnInit,
  Output,
} from '@angular/core';
import {
  SeasonTracklist,
  TracklistEpisode,
} from '../../../../shared/interfaces/tracklist-interfaces';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { EpisodeService } from '../../../../service/episode/episode.service';
import { SeasonEpisode } from '../../../../shared/interfaces/media-interfaces';
import { CreateTracklistEpisode } from '../../../../shared/interfaces/tracklist-episode-interfaces';
import { Observable } from 'rxjs';
import { UserService } from '../../../../service/user/user.service';

@Component({
  selector: 'app-create-tracklist-episode-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePickerModule,
    MessageModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    SelectModule,
  ],
  templateUrl: './create-tracklist-episode-form.component.html',
  styleUrl: './create-tracklist-episode-form.component.css',
})
export class CreateTracklistEpisodeFormComponent implements OnInit {
  // input variables
  public inpTracklist: InputSignal<SeasonTracklist> =
    input.required<SeasonTracklist>();
  public inpEpisode: InputSignal<SeasonEpisode> =
    input.required<SeasonEpisode>();
  public inpSeasonID: InputSignal<number> = input.required<number>();
  public inpIsEpisodeEditing: InputSignal<boolean> = input.required<boolean>();

  // output variables
  @Output() saveEpisode: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() cancelEpisode: EventEmitter<boolean> = new EventEmitter<boolean>();

  // other variables
  public createEpisodeForm!: FormGroup;
  public createEpisodeRequestData$: Observable<any> | null = null;
  public updateEpisodeRequestData$: Observable<any> | null = null;

  constructor(
    private messageService: MessageService,
    private episodeService: EpisodeService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // extract the episode of the tracklist (for retrieving e. g. watchDate and trakcklist episode id)
    const episodeInTracklist =
      this.inpTracklist().tracklistSeasons[0].tracklistEpisodes.filter(
        (epis: TracklistEpisode) => {
          return this.inpEpisode().id === epis.episode.id;
        }
      );

    const isEpisodeInTracklist: boolean =
      episodeInTracklist.length === 1 && this.inpIsEpisodeEditing();

    if (episodeInTracklist[0] && episodeInTracklist[0].watchDate) {
      const watchDateAsDate = new Date(episodeInTracklist[0].watchDate);
      watchDateAsDate.setHours(watchDateAsDate.getHours() - 1);
      this.createEpisodeForm = this.formBuilder.group({
        watchDate: [
          isEpisodeInTracklist &&
          episodeInTracklist[0] &&
          episodeInTracklist[0].watchDate &&
          episodeInTracklist[0].watchDate.length > 0
            ? watchDateAsDate
            : null,
        ],
      });
      return;
    }
    this.createEpisodeForm = this.formBuilder.group({
      watchDate: [null],
    });
  }

  /**
   * Function for add a new episode of the current selected season to the current selected episode.
   * @returns void
   */
  public submitForm = () => {
    const watchDate: string | null =
      this.createEpisodeForm.get('watchDate')?.value;
    let formattedDate: string = '';

    if (watchDate !== null) {
      const watchDateAsDate = new Date(watchDate);

      // increasing date hours by 1 hour
      watchDateAsDate.setHours(watchDateAsDate.getHours() + 1);

      formattedDate = watchDateAsDate.toISOString();
    }

    const createEpisodeData: CreateTracklistEpisode = {
      tracklistID: this.inpTracklist().id,
      tracklistSeasonID: this.inpTracklist().tracklistSeasons[0].id,
      watchDate: formattedDate,
      episodeID: this.inpEpisode().id,
    };

    this.makeAPIRequest(createEpisodeData, false);
  };

  public saveEditedEpisode = () => {
    const watchDate: string | null =
      this.createEpisodeForm.get('watchDate')?.value;
    let formattedDate: string = '';

    if (watchDate !== null) {
      const watchDateAsDate = new Date(watchDate);

      // increasing date hours by 1 hour
      watchDateAsDate.setHours(watchDateAsDate.getHours() + 1);

      formattedDate = watchDateAsDate.toISOString();
    }

    const episodeInTracklist =
      this.inpTracklist().tracklistSeasons[0].tracklistEpisodes.filter(
        (epis: TracklistEpisode) => {
          return this.inpEpisode().id === epis.episode.id;
        }
      );

    const updateEpisodeData: CreateTracklistEpisode = {
      tracklistID: this.inpTracklist().id,
      tracklistSeasonID: this.inpTracklist().tracklistSeasons[0].id,
      watchDate: formattedDate,
      episodeID: episodeInTracklist[0].id, // tracklist episode id
    };

    this.makeAPIRequest(updateEpisodeData, true);
  };

  public makeAPIRequest = (
    episodeData: CreateTracklistEpisode,
    isUpdatingEpisode: boolean
  ) => {
    const errorMessageSummary: string = isUpdatingEpisode
      ? 'Fehler beim Speichern der Episode'
      : 'Fehler beim Hinzufügen der Episode';

    const errorMessageDetail: string = isUpdatingEpisode
      ? 'Beim Speichern der Episode ist ein Fehler aufgetreten. Bitte probiere es erneut.'
      : 'Beim Hinzufügen der Episode ist ein Fehler aufgetreten. Bitte probiere es erneut.';

    if (!isUpdatingEpisode) {
      this.createEpisodeRequestData$ =
        this.episodeService.createTracklistEpisode(episodeData);

      if (!this.createEpisodeRequestData$) {
        this.messageService.add({
          life: 7000,
          severity: 'error',
          summary: errorMessageSummary,
          detail: errorMessageDetail,
        });
        return;
      }

      this.createEpisodeRequestData$.subscribe({
        next: () => {
          this.messageService.add({
            life: 7000,
            severity: 'success',
            summary: 'Episode erfolgreich hinzugefügt',
          });
          this.saveEpisode.emit(true);
        },
        error: (err: any) => {
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
            summary: errorMessageSummary,
            detail: errorMessageDetail,
          });
        },
      });

      return;
    }

    this.updateEpisodeRequestData$ =
      this.episodeService.updateTracklistEpisode(episodeData);

    if (!this.updateEpisodeRequestData$) {
      this.messageService.add({
        life: 7000,
        severity: 'error',
        summary: errorMessageSummary,
        detail: errorMessageDetail,
      });
      return;
    }

    this.updateEpisodeRequestData$.subscribe({
      next: () => {
        this.messageService.add({
          life: 7000,
          severity: 'success',
          summary: 'Episode erfolgreich gespeichert',
        });
        this.saveEpisode.emit(true);
      },
      error: (err: any) => {
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
          summary: errorMessageSummary,
          detail: errorMessageDetail,
        });
      },
    });
  };

  public cancelEpisodeForm = () => {
    this.cancelEpisode.emit(true);
  };
}
