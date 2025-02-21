import { Component, Input, input, InputSignal } from '@angular/core';
import { SeasonEpisode } from '../../../shared/interfaces/media-interfaces';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DateFormattingPipe } from '../../../pipes/date-formatting/date-formatting.pipe';
import { TracklistService } from '../../../service/tracklist/tracklist.service';
import { FormGroup } from '@angular/forms';
import {
  SeasonTracklist,
  TVSeasonWithTracklist,
} from '../../../shared/interfaces/tracklist-interfaces';

@Component({
  selector: 'app-episode-list',
  imports: [CommonModule, DialogModule, DateFormattingPipe],
  templateUrl: './episode-list.component.html',
  styleUrl: './episode-list.component.css',
})
export class EpisodeListComponent {
  public episodeList: InputSignal<SeasonEpisode[]> =
    input.required<SeasonEpisode[]>();
  public currentEpisodeForDialog: SeasonEpisode | null = null;
  public isEpisodeDialogVisible: boolean = false;
  public tracklistSelectionForm: InputSignal<FormGroup<any>> =
    input.required<FormGroup<any>>();
  public selectedSeason: InputSignal<TVSeasonWithTracklist | null> =
    input.required<TVSeasonWithTracklist | null>();
  public tracklistsOfSeason: InputSignal<SeasonTracklist[]> =
    input.required<SeasonTracklist[]>();

  constructor(private tracklistService: TracklistService) {}

  public openDialog = (currenEpisode: SeasonEpisode) => {
    this.currentEpisodeForDialog = currenEpisode;
    this.isEpisodeDialogVisible = true;

    console.log('open');
  };

  public checkEpisodeInCurrentTracklist = (episodeID: number): boolean => {
    return this.tracklistService.isEpisodeInCurrenTracklist(
      episodeID,
      this.selectedSeason(),
      this.tracklistsOfSeason(),
      this.tracklistSelectionForm()
    );
  };
}
