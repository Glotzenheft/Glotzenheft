import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { SelectModule } from 'primeng/select';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DateFormattingPipe } from '../../../../pipes/date-formatting/date-formatting.pipe';
import { EpisodeListComponent } from '../../episodesCOMPONENTS/episode-list/episode-list.component';
import { TracklistFormComponent } from '../../tracklistCOMPONENTS/updateTracklistPages/tracklist-form/tracklist-form.component';
import { UpdateTracklistFormComponent } from '../../tracklistCOMPONENTS/updateTracklistPages/update-tracklist-form/update-tracklist-form.component';
import { MenuModule } from 'primeng/menu';
import { CreateTracklistEpisodeFormComponent } from '../../episodesCOMPONENTS/tracklist-episodes/create-tracklist-episode-form/create-tracklist-episode-form.component';
import {
  Season,
  SeasonEpisode,
  SeasonWithEpisodes,
} from '../../../../shared/interfaces/media-interfaces';
import {
  SeasonTracklist,
  SeasonTracklistType,
  TVSeasonWithTracklist,
  TVWithTracklist,
} from '../../../../shared/interfaces/tracklist-interfaces';
import { TMDB_POSTER_PATH } from '../../../../shared/variables/tmdb-vars';
import { StringService } from '../../../../service/string/string.service';
import { MediaService } from '../../../../service/media/media.service';
import { SecurityService } from '../../../../service/security/security.service';
import { UserService } from '../../../../service/user/user.service';
import { TracklistService } from '../../../../service/tracklist/tracklist.service';
import { ERR_OBJECT_INVALID_AUTHENTICATION } from '../../../../shared/variables/message-vars';
import { ROUTES_LIST } from '../../../../shared/variables/routes-list';

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
    FloatLabelModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    EpisodeListComponent,
    AccordionModule,
    SelectModule,
    MenuModule,
    CreateTracklistEpisodeFormComponent,
  ],
  templateUrl: './season-page.component.html',
  styleUrl: './season-page.component.css',
})
export class SeasonPageComponent implements OnInit {
  public tvSeriesID: string | null = null;
  public seasonData$: Observable<Season> | null = null;
  public tvDataWithTracklist: TVWithTracklist | null = null;
  public episodeRating: number = 0;
  public posterPath: string = TMDB_POSTER_PATH;

  public hasError: boolean = false;
  public isInvalidID: boolean = false;

  public visibleSeason: SeasonWithEpisodes | null = null;
  public selectedSeason: TVSeasonWithTracklist | null = null;
  public tracklistsOfSeason: SeasonTracklist[] = [];

  public trackListForm!: FormGroup;
  public isTracklistSubmitted: boolean = false;
  public tracklistSelectionForm!: FormGroup;

  public currentTracklistSelection: SeasonTracklistType | null = null;

  // dialog and visibility variables --------------------------
  // = 0: media details; = 1: create tracklist; = 2: update tracklist; = 3: add new episode to current tracklist; = 4: edit episode of current tracklist
  public isTracklistFormVisible: number = 0;

  // variables for current object values
  public currentSeason: TVSeasonWithTracklist | null = null;
  public currentTracklist: SeasonTracklist | null = null;
  public currentEpisode: SeasonEpisode | null = null;

  public isEditingButtonVisible: boolean = true;

  public EMPTY_TRACKLIST: SeasonTracklist = {
    id: -1,
    media: {
      id: -1, // id of the tv or movie itself
      type: '', // "movie" or "tv"
    },
    rating: -1,
    status: '',
    startDate: '',
    finishDate: '',
    tracklistName: '',
    tracklistSeasons: [],
  };

  constructor(
    public stringService: StringService,
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private securityService: SecurityService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private tracklistService: TracklistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // functions -----------------------------------------------------

  public loadData = () => {
    this.tvSeriesID = this.route.snapshot.paramMap.get('id');

    if (!this.tvSeriesID) {
      this.hasError = true;
      return;
    }

    if (!this.securityService.validateMediaURL(this.tvSeriesID)) {
      this.isInvalidID = true;
      return;
    }

    // checking if "media_id" already exists:
    this.seasonData$ = this.mediaService.getSeasonForTV(this.tvSeriesID);

    if (!this.seasonData$) {
      this.hasError = true;

      return;
    }

    this.seasonData$.subscribe({
      next: (res: Season) => {
        this.trackListForm = this.formBuilder.group({
          trackListName: [res.media.name, Validators.required],
        });

        this.currentTracklist = res.tracklists[0];

        // join seasondata with tracklists
        this.tvDataWithTracklist =
          this.tracklistService.joinTVWithTracklists(res);

        this.tracklistSelectionForm = this.formBuilder.group({
          selectedTracklist: [this.EMPTY_TRACKLIST],
        });
        this.tracklistsOfSeason = res.tracklists;
      },
      error: (err) => {
        if (err.status === 401) {
          this.userService.logoutOfAccount();
          this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
          this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
        }

        this.hasError = true;
      },
    });
  };

  public openTracklistForm = (season: TVSeasonWithTracklist) => {
    this.currentSeason = season;
    this.isTracklistFormVisible = 1;
  };

  public hasErrorField = (field: string) => {
    const fieldControl = this.trackListForm.get(field);

    return (
      fieldControl! &&
      (fieldControl!.dirty ||
        fieldControl!.touched ||
        this.isTracklistSubmitted)
    );
  };

  public setSelectedSeason = (season: TVSeasonWithTracklist) => {
    if (season.id !== this.currentSeason?.id) {
      // set form to the first tracklist value of all tracklists that belong to this season
      // do not set form if the current selected season is equal to the parameter "season" -> otherwise the selection won't work anymore!
      let currentTracklistInLocalStorage: SeasonTracklist | null = null;

      const currentTracklistInLocalStorageID: number | null =
        this.tracklistService.getSelectedTracklistInLocalStorage()
          ? Number(this.tracklistService.getSelectedTracklistInLocalStorage())
          : null;

      if (
        // checking if current tracklist in local storage is in this season
        currentTracklistInLocalStorageID &&
        season.tracklistsForSeason
          .map((tracklist: SeasonTracklist) => tracklist.id)
          .includes(currentTracklistInLocalStorageID)
      ) {
        currentTracklistInLocalStorage = season.tracklistsForSeason.filter(
          (tracklist: SeasonTracklist) =>
            tracklist.id === currentTracklistInLocalStorageID
        )[0];
      }

      this.tracklistSelectionForm
        .get('selectedTracklist')
        ?.setValue(
          season.tracklistsForSeason.length > 0
            ? currentTracklistInLocalStorage
              ? currentTracklistInLocalStorage
              : season.tracklistsForSeason[0]
            : this.EMPTY_TRACKLIST
        );
    }

    this.selectedSeason = season;
    this.currentSeason = season;

    if (
      this.tracklistSelectionForm.get('selectedTracklist')?.value !==
      this.EMPTY_TRACKLIST
    ) {
      this.isEditingButtonVisible = true;
      return;
    }

    this.isEditingButtonVisible = false;
  };

  public setCurrentEpisode = (
    episode: SeasonEpisode,
    isEpisodeForEditing: boolean
  ) => {
    this.currentEpisode = episode;

    if (!isEpisodeForEditing) {
      this.setVisibility(3);
      return;
    }
    this.setVisibility(4);
  };

  public refreshPage = () => {
    this.currentSeason = null;
    this.setVisibility(0);
    this.loadData();
  };
  public cancelTracklistForm = () => {
    this.isTracklistFormVisible = 0;
  };

  public setVisibility = (page: number) => {
    this.isTracklistFormVisible = page;
  };

  public setSelectedTrackilst = (tracklist: SeasonTracklistType) => {
    this.currentTracklistSelection = tracklist;
    this.isTracklistFormVisible = 3;
  };
}
