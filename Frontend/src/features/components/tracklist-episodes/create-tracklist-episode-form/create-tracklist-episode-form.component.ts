import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  OnInit,
  Output,
} from '@angular/core';
import { SeasonTracklist } from '../../../../shared/interfaces/tracklist-interfaces';
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

  // output variables
  @Output() saveEpisode: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() cancelEpisode: EventEmitter<boolean> = new EventEmitter<boolean>();

  // other variables
  public createEpisodeForm!: FormGroup;
  public createEpisodeRequestData$: Observable<any> | null = null;

  constructor(
    private messageService: MessageService,
    private episodeService: EpisodeService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.createEpisodeForm = this.formBuilder.group({
      watchDate: [null],
    });
  }

  public submitForm = () => {
    const watchDate: string | null =
      this.createEpisodeForm.get('watchDate')?.value;
    console.log(watchDate, watchDate === null);
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

    console.log('submit data: ', createEpisodeData);

    this.createEpisodeRequestData$ =
      this.episodeService.createTracklistEpisode(createEpisodeData);

    if (!this.createEpisodeRequestData$) {
      this.messageService.add({
        life: 7000,
        severity: 'error',
        summary: 'Fehler beim Hinzufügen der Episode',
        detail:
          'Beim Hinzufügen der Episode ist ein Fehler aufgetreten. Bitte probiere es erneut.',
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
          summary: 'Fehler beim Hinzufügen der Episode',
          detail:
            'Beim Hinzufügen der Episode ist ein Fehler aufgetreten. Bitte probiere es erneut.',
        });
      },
    });
  };

  public cancelEpisodeForm = () => {
    this.cancelEpisode.emit(true);
  };
}
