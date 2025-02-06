import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Episode, Season } from '../../../shared/interfaces/media-interfaces';
import { Observable, of } from 'rxjs';
import { MediaService } from '../../../service/media/media.service';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { TEST_SEASON } from '../../../test-data/test-season';
import { StringService } from '../../../service/string/string.service';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../../service/navigation/navigation.service';
import { DateFormattingPipe } from '../../../pipes/date-formatting/date-formatting.pipe';

@Component({
  selector: 'app-season-page',
  imports: [
    CommonModule,
    PanelModule,
    CardModule,
    DialogModule,
    RatingModule,
    FormsModule,
    ButtonModule,
    DateFormattingPipe,
  ],
  templateUrl: './season-page.component.html',
  styleUrl: './season-page.component.css',
})
export class SeasonPageComponent implements OnInit {
  seasonID: string | null = null;
  tvSeriesID: string | null = null;
  seasonData$: Observable<Season> | null = null;
  episodeRating: number = 0;

  hasError: boolean = false;
  isDialogVisible: boolean = false;
  visibleEpisode: Episode | null = null;

  constructor(
    public stringService: StringService,
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.tvSeriesID = this.route.snapshot.paramMap.get('id');

    if (!this.tvSeriesID) {
      this.hasError = true;
      if (!this.seasonID) {
      }
      return;
    }

    this.seasonData$ = this.mediaService.getSeasonForTV(this.tvSeriesID);

    if (!this.seasonData$) {
      this.hasError = true;
    }

    this.seasonData$.subscribe({
      error: (err) => {
        this.hasError = true;
      },
    });
  }

  showEpisodeDialog = (episode: Episode) => {
    this.isDialogVisible = true;

    this.visibleEpisode = episode;
  };

  saveEpisode = (episode: Episode) => {
    this.isDialogVisible = false;
  };

  closeEpisodeDialog = () => {
    this.isDialogVisible = false;
  };

  navigateToMultiSearch = () => {
    this.navigationService.navigateToMultiSearch();
  };
}
