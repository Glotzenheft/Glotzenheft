import { Component, input, InputSignal } from '@angular/core';
import { SeasonEpisode } from '../../../shared/interfaces/media-interfaces';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DateFormattingPipe } from '../../../pipes/date-formatting/date-formatting.pipe';

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

  public openDialog = (currenEpisode: SeasonEpisode) => {
    this.currentEpisodeForDialog = currenEpisode;
    this.isEpisodeDialogVisible = true;

    console.log('open');
  };
}
