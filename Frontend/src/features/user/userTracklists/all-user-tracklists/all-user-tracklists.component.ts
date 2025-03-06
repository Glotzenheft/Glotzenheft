import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DateFormattingPipe } from '../../../../pipes/date-formatting/date-formatting.pipe';
import { UpdateFilmTracklistComponent } from '../../../media/tracklistCOMPONENTS/updateTracklistPages/update-film-tracklist/update-film-tracklist.component';
import { UpdateTracklistFormComponent } from '../../../media/tracklistCOMPONENTS/updateTracklistPages/update-tracklist-form/update-tracklist-form.component';
import { Tracklist } from '../../../../shared/interfaces/tracklist-interfaces';
import { TMDB_POSTER_PATH } from '../../../../shared/variables/tmdb-vars';
import { convertTracklistStatusIntoGerman } from '../../../../shared/variables/tracklist';
import { MediaService } from '../../../../service/media/media.service';
import { ROUTES_LIST } from '../../../../shared/variables/routes-list';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-all-user-tracklists',
  imports: [
    CommonModule,
    CardModule,
    DateFormattingPipe,
    DialogModule,
    TableModule,
    AccordionModule,
    PanelModule,
    RatingModule,
    FormsModule,
    ButtonModule,
    UpdateFilmTracklistComponent,
    UpdateTracklistFormComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './all-user-tracklists.component.html',
  styleUrl: './all-user-tracklists.component.css',
})
export class AllUserTracklistsComponent implements OnInit {
  public userTracklists$: Observable<Tracklist[]> | null = null;
  public posterPath: string = TMDB_POSTER_PATH;
  public isDialogVisible: boolean = false;
  public currentTracklist: Tracklist | null = null;
  public tracklistStatusClass: string | null = null;
  public tmdbPosterPath: string = TMDB_POSTER_PATH;
  public visibility: number = 0;

  public isLoading: boolean = false;

  public convertStatus = convertTracklistStatusIntoGerman;

  constructor(private mediaService: MediaService, private router: Router) {}

  ngOnInit(): void {
    this.loadTracklists();
  }

  public loadTracklists = () => {
    this.isLoading = true;
    this.userTracklists$ = this.mediaService.getAllUserTracklists();

    if (!this.userTracklists$) {
      return;
    }

    this.userTracklists$.subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 401) {
          this.router.navigateByUrl(`/${ROUTES_LIST[1].fullUrl}`);
        }
        this.isLoading = false;
      },
    });
  };

  public navigateToDetailspage = (mediaID: number, mediaType: string) => {
    let url: string =
      mediaType.trim() === 'movie'
        ? `${ROUTES_LIST[5].fullUrl}/${mediaID}`
        : `${ROUTES_LIST[6].fullUrl}/${mediaID}`;

    this.router.navigateByUrl(url);
  };

  /**
   * Function for settting the CSS class for the current status of the tracklist.
   * @param status string
   * @returns string
   */
  public setTracklistStatus = (status: string): string => {
    switch (status) {
      case 'watching':
        this.tracklistStatusClass = 'statusWatching';
        return 'statusWatching';

      case 'pausing':
        this.tracklistStatusClass = 'statusPausing';
        return 'statusPausing';

      case 'dropped':
        this.tracklistStatusClass = 'statusDropped';
        return 'statusDropped';

      case 'rewatching':
        this.tracklistStatusClass = 'statusRewatching';
        return 'statusRewatching';

      case 'plan to watch':
        this.tracklistStatusClass = 'statusPlanToWatch';
        return 'statusPlanToWatch';

      case 'completed':
        this.tracklistStatusClass = 'statusCompleted';
        return 'statusCompleted';
    }
    return '';
  };

  /**
   * Function for switching them visible component to the editing tracklist interface.
   * @param tracklist Tracklist
   * @param isMovie boolean
   * @returns void
   */
  public editTracklist = (tracklist: Tracklist, isMovie: boolean) => {
    this.currentTracklist = tracklist;
    this.visibility = isMovie ? 1 : 2;
  };

  /**
   * Function returning the page to the tracklist list page.
   * @param isCancelling boolean
   * @return void
   */
  public refreshPage = (isCancelling: boolean) => {
    // refreshing page
    this.visibility = 0;

    if (!isCancelling) {
      // refresh page if user has updated tracklist
      this.loadTracklists();
    }
  };
}
