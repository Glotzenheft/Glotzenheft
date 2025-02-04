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
    private route: ActivatedRoute,
    private mediaService: MediaService,
    public stringService: StringService
  ) {}

  ngOnInit(): void {
    this.seasonID = this.route.snapshot.paramMap.get('seasonID');
    this.tvSeriesID = this.route.snapshot.paramMap.get('id');

    if (!this.seasonID || !this.tvSeriesID) {
      this.hasError = true;
      if (!this.seasonID) {
      } else if (!this.tvSeriesID) {
      }

      return;
    }

    this.seasonData$ = this.mediaService.getSeasonForTV(
      this.tvSeriesID,
      this.seasonID
    );
    // this.seasonData$ = of(TEST_SEASON);

    if (!this.seasonData$) {
      this.hasError = true;
    }
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
}
