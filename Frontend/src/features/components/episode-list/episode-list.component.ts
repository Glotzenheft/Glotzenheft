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
import { TracklistService } from '../../../service/tracklist/tracklist.service';
import { FormGroup } from '@angular/forms';
import {
  SeasonTracklist,
  TracklistEpisode,
  TVSeasonWithTracklist,
} from '../../../shared/interfaces/tracklist-interfaces';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

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
  public inpSelectedTracklist: InputSignal<SeasonTracklist> =
    input.required<SeasonTracklist>();
  public tracklistSelectionForm: InputSignal<FormGroup<any>> =
    input.required<FormGroup<any>>();
  public selectedSeason: InputSignal<TVSeasonWithTracklist | null> =
    input.required<TVSeasonWithTracklist | null>();
  public tracklistsOfSeason: InputSignal<SeasonTracklist[]> =
    input.required<SeasonTracklist[]>();

  public currentEpisodeForDialog: SeasonEpisode | null = null;
  public isEpisodeDialogVisible: boolean = false;
  // output variables
  @Output() setEpisode: EventEmitter<SeasonEpisode> =
    new EventEmitter<SeasonEpisode>();

  constructor(private tracklistService: TracklistService) {}

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

  public selectEpisode = (episode: SeasonEpisode) => {
    this.setEpisode.emit(episode);
  };
}
