import {
  Component,
  EventEmitter,
  Input,
  input,
  InputSignal,
  OnInit,
  Output,
} from '@angular/core';
import { SeasonEpisode } from '../../../shared/interfaces/media-interfaces';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DateFormattingPipe } from '../../../pipes/date-formatting/date-formatting.pipe';
import { FormGroup } from '@angular/forms';
import {
  SeasonTracklist,
  TracklistEpisode,
  TVSeasonWithTracklist,
} from '../../../shared/interfaces/tracklist-interfaces';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { StringService } from '../../../service/string/string.service';
import { TMDB_POSTER_PATH } from '../../../shared/variables/tmdb-vars';

@Component({
  selector: 'app-episode-list',
  imports: [
    CommonModule,
    DialogModule,
    DateFormattingPipe,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './episode-list.component.html',
  styleUrl: './episode-list.component.css',
})
export class EpisodeListComponent {
  // input variables
  public episodeList: InputSignal<SeasonEpisode[]> =
    input.required<SeasonEpisode[]>();
  public inpSelectedTracklist: InputSignal<SeasonTracklist | null> =
    input.required<SeasonTracklist | null>();
  public tracklistSelectionForm: InputSignal<FormGroup<any> | null> =
    input.required<FormGroup<any> | null>();
  public selectedSeason: InputSignal<TVSeasonWithTracklist | null> =
    input.required<TVSeasonWithTracklist | null>();
  public tracklistsOfSeason: InputSignal<SeasonTracklist[]> =
    input.required<SeasonTracklist[]>();
  public inpIsWithTracklist: InputSignal<boolean> = input.required<boolean>();

  public posterPath: string = TMDB_POSTER_PATH;

  public currentEpisodeForDialog: SeasonEpisode | null = null;
  public isEpisodeDialogVisible: boolean = false;
  // output variables
  @Output() setEpisode: EventEmitter<SeasonEpisode> =
    new EventEmitter<SeasonEpisode>();
  @Output() setEpisodeForEditing: EventEmitter<SeasonEpisode> =
    new EventEmitter<SeasonEpisode>();

  constructor(public stringService: StringService) {}

  public openDialog = (currenEpisode: SeasonEpisode) => {
    this.currentEpisodeForDialog = currenEpisode;
    this.isEpisodeDialogVisible = true;
  };

  public checkEpisodeInCurrentTracklist = (episodeID: number): boolean => {
    const episodesOfTracklist: number[] =
      this.inpSelectedTracklist()!.tracklistSeasons[0].tracklistEpisodes.map(
        (epis: TracklistEpisode) => {
          return epis.episode.id;
        }
      );

    if (episodesOfTracklist.includes(episodeID)) {
      return true;
    }
    return false;

    // return this.tracklistService.isEpisodeInCurrenTracklist(
    //   episodeID,
    //   this.selectedSeason(),
    //   this.tracklistsOfSeason(),
    //   this.tracklistSelectionForm()
    // );
  };

  public selectEpisode = (
    episode: SeasonEpisode,
    isEpisodeEditing: boolean
  ) => {
    if (!isEpisodeEditing) {
      this.setEpisode.emit(episode);
      return;
    }

    this.setEpisodeForEditing.emit(episode);
  };
}
