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
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DateFormattingPipe } from '../../../../pipes/date-formatting/date-formatting.pipe';
import { UpdateFilmTracklistComponent } from '../../../media/tracklistCOMPONENTS/updateTracklistPages/update-film-tracklist/update-film-tracklist.component';
import { UpdateTracklistFormComponent } from '../../../media/tracklistCOMPONENTS/updateTracklistPages/update-tracklist-form/update-tracklist-form.component';
import { Tracklist } from '../../../../shared/interfaces/tracklist-interfaces';
import { TMDB_POSTER_PATH } from '../../../../shared/variables/tmdb-vars';
import {
  convertTracklistStatusIntoGerman,
  TRACK_LIST_STATUS_LIST,
  TRACK_LIST_STATUS_LIST_AS_OBJECT,
  TracklistStatusType,
} from '../../../../shared/variables/tracklist';
import { MediaService } from '../../../../service/media/media.service';
import { ROUTES_LIST } from '../../../../shared/variables/routes-list';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';

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
    SelectModule,
    ReactiveFormsModule,
    FloatLabelModule,
  ],
  templateUrl: './all-user-tracklists.component.html',
  styleUrl: './all-user-tracklists.component.css',
})
export class AllUserTracklistsComponent implements OnInit {
  public userTracklists$: Observable<Tracklist[]> | null = null;
  public allTracklists: Tracklist[] | null = null;
  public sortedUserTracklists: Tracklist[] | null = null;

  public currentFilterForm!: FormGroup;

  public tracklistStatusFilterList: { german: string; value: string }[] =
    TRACK_LIST_STATUS_LIST_AS_OBJECT;
  public currentFilterStatus: TracklistStatusType = 'watching';

  public tracklistMediaTypeFilterList: { german: string; value: string }[] = [
    {
      german: 'Alle Medien',
      value: 'all',
    },
    {
      german: 'Filme',
      value: 'movie',
    },
    {
      german: 'Serien',
      value: 'tv',
    },
  ];
  public currentFilterMediaType: 'all' | 'movie' | 'tv' = 'all';

  public posterPath: string = TMDB_POSTER_PATH;
  public isDialogVisible: boolean = false;
  public currentTracklist: Tracklist | null = null;
  public tracklistStatusClass: string | null = null;
  public tmdbPosterPath: string = TMDB_POSTER_PATH;
  public visibility: number = 0;

  public isLoading: boolean = false;

  public convertStatus = convertTracklistStatusIntoGerman;

  constructor(
    private mediaService: MediaService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currentFilterForm = this.formBuilder.group({
      statusFilter: this.tracklistStatusFilterList[0],
      mediaFilter: this.tracklistMediaTypeFilterList[0],
    });

    this.loadTracklists();
  }

  public loadTracklists = () => {
    this.isLoading = true;
    this.userTracklists$ = this.mediaService.getAllUserTracklists();

    if (!this.userTracklists$) {
      return;
    }

    this.userTracklists$.subscribe({
      next: (res: Tracklist[]) => {
        this.isLoading = false;
        this.sortedUserTracklists = res
          .filter((tracklist: Tracklist) => {
            return (
              tracklist.status ===
              this.currentFilterForm.get('statusFilter')?.value.value
            );
          })
          .filter((tracklist: Tracklist) => {
            if (
              this.currentFilterForm.get('mediaFilter')?.value.value === 'all'
            ) {
              return true;
            } else {
              return (
                tracklist.media.type ===
                this.currentFilterForm.get('mediaFilter')?.value.value
              );
            }
          });

        this.allTracklists = res;
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

  public setSortedTracklistList = () => {
    // sorting the list with the current values of the selections
    if (!this.allTracklists) {
      return;
    }

    this.sortedUserTracklists = this.allTracklists
      .filter((tracklist: Tracklist) => {
        return (
          tracklist.status ===
          this.currentFilterForm.get('statusFilter')?.value.value
        );
      })
      .filter((tracklist: Tracklist) => {
        if (this.currentFilterForm.get('mediaFilter')?.value.value === 'all') {
          return true;
        }

        return (
          tracklist.media.type ===
          this.currentFilterForm.get('mediaFilter')?.value.value
        );
      });
  };
}
