import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  Output,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DateFormattingPipe } from '../../../../pipes/date-formatting/date-formatting.pipe';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SeasonEpisode } from '../../../../shared/interfaces/media-interfaces';
import { StringService } from '../../../../service/string/string.service';
import { TMDB_POSTER_PATH } from '../../../../shared/variables/tmdb-vars';

@Component({
  selector: 'app-episode-list-without-tracklist',
  imports: [
    CommonModule,
    DialogModule,
    DateFormattingPipe,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './episode-list-without-tracklist.component.html',
  styleUrl: './episode-list-without-tracklist.component.css',
})
export class EpisodeListWithoutTracklistComponent {
  // input variables
  public inpEpisodeList: InputSignal<SeasonEpisode[]> =
    input.required<SeasonEpisode[]>();

  // output variables
  @Output() setEpisode: EventEmitter<SeasonEpisode> =
    new EventEmitter<SeasonEpisode>();

  // other variables
  public currentEpisodeForDialog: SeasonEpisode | null = null;
  public isEpisodeDialogVisible: boolean = false;
  public posterPath: string = TMDB_POSTER_PATH;

  // functions ----------------------------------------------

  constructor(public stringService: StringService) {}

  public selectEpisode = (episode: SeasonEpisode) => {
    this.setEpisode.emit(episode);
  };

  public openDialog = (currentEpisode: SeasonEpisode) => {
    this.currentEpisodeForDialog = currentEpisode;
    console.log(currentEpisode);
    this.isEpisodeDialogVisible = true;
  };
}
