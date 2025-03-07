import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../../../../sharedCOMPONENTS/delete-dialog/delete-dialog.component';
import {
  SeasonTracklist,
  TracklistEpisode,
} from '../../../../../shared/interfaces/tracklist-interfaces';
import { SeasonEpisode } from '../../../../../shared/interfaces/media-interfaces';
import { EpisodeService } from '../../../../../service/episode/episode.service';
import { UserService } from '../../../../../service/user/user.service';
import { TracklistService } from '../../../../../service/tracklist/tracklist.service';
import { CreateTracklistEpisode } from '../../../../../shared/interfaces/tracklist-episode-interfaces';
import {
  ERR_OBJECT_INVALID_AUTHENTICATION,
  getMessageObject,
} from '../../../../../shared/variables/message-vars';
import { ROUTES_LIST } from '../../../../../shared/variables/routes-list';

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
    TooltipModule,
    DeleteDialogComponent,
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
  public deleteEpisodeRequestData$: Observable<any> | null = null;

  public isDeletionDialogVisible: boolean = false;

  constructor(
    private messageService: MessageService,
    private episodeService: EpisodeService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private tracklistService: TracklistService
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
      watchDateAsDate.setHours(watchDateAsDate.getHours());
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
      watchDate: [!this.inpIsEpisodeEditing() ? new Date() : null],
    });

    // set local storage tracklist to selected tracklist
    this.tracklistService.setSelectedTracklistInLocalStorage(
      this.inpTracklist().id
    );
  }

  public deleteDate = () => {
    this.createEpisodeForm.get('watchDate')?.setValue(null);
  };

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

      // increasing date hours by 2 hour to match German time
      watchDateAsDate.setHours(watchDateAsDate.getHours() + 2);

      formattedDate = watchDateAsDate.toISOString();
    }

    const createEpisodeData: CreateTracklistEpisode = {
      tracklistID: this.inpTracklist().id,
      tracklistSeasonID: this.inpTracklist().tracklistSeasons[0].id,
      watchDate: formattedDate,
      episodeID: this.inpEpisode().id,
    };

    this.makeAPIRequest(createEpisodeData, 0);
  };

  public saveEditedEpisode = () => {
    const watchDate: string | null =
      this.createEpisodeForm.get('watchDate')?.value;
    let formattedDate: string = '';

    if (watchDate !== null) {
      const watchDateAsDate = new Date(watchDate);

      // increase date hours by 2 hour to match German time
      watchDateAsDate.setHours(watchDateAsDate.getHours() + 2);

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

    this.makeAPIRequest(updateEpisodeData, 1);
  };

  public deleteEpisode = () => {
    this.setDeletionDialogVisibilityStatus(false);

    const episodeInTracklist =
      this.inpTracklist().tracklistSeasons[0].tracklistEpisodes.filter(
        (epis: TracklistEpisode) => {
          return this.inpEpisode().id === epis.episode.id;
        }
      );

    if (episodeInTracklist.length < 1) {
      this.messageService.add(
        getMessageObject(
          'error',
          'Episode nicht gefunden',
          'Das Löschen ist fehlgeschlagen. Bitte probiere es erneut.'
        )
      );

      return;
    }

    const deleteEpisodeData: CreateTracklistEpisode = {
      tracklistID: this.inpTracklist().id,
      tracklistSeasonID: this.inpTracklist().tracklistSeasons[0].id,
      watchDate: '',
      episodeID: episodeInTracklist[0].id, // tracklist episode id
    };

    this.makeAPIRequest(deleteEpisodeData, 2);
  };

  /**
   *
   * @param episodeData CreateTracklistEpisode
   * @param episodeActionNumber number -> 0 (create), 1 (update) or 2 (delete) episode
   * @returns
   */
  public makeAPIRequest = (
    episodeData: CreateTracklistEpisode,
    episodeActionNumber: number
  ) => {
    // = 0: create episode; = 1: update selected episode; = 2: delete episode
    const errorMessageSummary: string =
      episodeActionNumber === 0
        ? 'Fehler beim Hinzufügen der Episode'
        : episodeActionNumber === 1
        ? 'Fehler beim Speichern der Episode'
        : 'Fehler beim Löschen der Episode';

    const errorMessageDetail: string =
      episodeActionNumber === 0
        ? 'Beim Hinzufügen der Episode ist ein Fehler aufgetreten. Bitte probiere es erneut.'
        : episodeActionNumber === 1
        ? 'Beim Speichern der Episode ist ein Fehler aufgetreten. Bitte probiere es erneut.'
        : 'Beim Löschen der Episode ist ein Fehler aufgetreten. Bitte probiere es erneut.';

    if (episodeActionNumber === 0) {
      this.createEpisodeRequestData$ =
        this.episodeService.createTracklistEpisode(episodeData);

      if (!this.createEpisodeRequestData$) {
        this.messageService.add(
          getMessageObject('error', errorMessageSummary, errorMessageDetail)
        );
        return;
      }

      this.createEpisodeRequestData$.subscribe({
        next: () => {
          this.messageService.add(
            getMessageObject('success', 'Episode erfolgreich hinzugefügt')
          );
          this.saveEpisode.emit(true);
        },
        error: (err: any) => {
          if (err.status === 401) {
            // logout user of account
            this.userService.logoutOfAccount();
            this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
            this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
            return;
          }
          this.messageService.add(
            getMessageObject('error', errorMessageSummary, errorMessageDetail)
          );
        },
      });

      return;
    } else if (episodeActionNumber === 1) {
      // updating episode
      this.updateEpisodeRequestData$ =
        this.episodeService.updateTracklistEpisode(episodeData);

      if (!this.updateEpisodeRequestData$) {
        this.messageService.add(
          getMessageObject('error', errorMessageSummary, errorMessageDetail)
        );
        return;
      }

      this.updateEpisodeRequestData$.subscribe({
        next: () => {
          this.messageService.add(
            getMessageObject('success', 'Episode erfolgreich gespeichert')
          );
          this.saveEpisode.emit(true);
        },
        error: (err: any) => {
          if (err.status === 401) {
            this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
            return;
          }
          this.messageService.add(
            getMessageObject('error', errorMessageSummary, errorMessageDetail)
          );
        },
      });
    } else if (episodeActionNumber === 2) {
      // delete episode
      this.deleteEpisodeRequestData$ =
        this.episodeService.deleteTracklistEpisode(
          episodeData.tracklistID,
          episodeData.tracklistSeasonID,
          episodeData.episodeID
        );

      if (!this.deleteEpisodeRequestData$) {
        this.messageService.add(
          getMessageObject('error', errorMessageSummary, errorMessageDetail)
        );
        return;
      }

      this.deleteEpisodeRequestData$.subscribe({
        next: () => {
          this.messageService.add(
            getMessageObject('success', 'Episode erfolgreich gelöscht')
          );
          this.saveEpisode.emit(true);
        },
        error: (err: any) => {
          if (err.status === 401) {
            this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
            return;
          }
          this.messageService.add(
            getMessageObject('error', errorMessageSummary, errorMessageDetail)
          );
        },
      });
    }
  };

  public cancelEpisodeForm = () => {
    this.cancelEpisode.emit(true);
  };

  public setDeletionDialogVisibilityStatus = (status: boolean) => {
    this.isDeletionDialogVisible = status;
  };
}
