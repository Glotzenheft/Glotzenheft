import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Season,
  SeasonWithEpisodes,
} from '../../../shared/interfaces/media-interfaces';
import { Observable, of } from 'rxjs';
import { MediaService } from '../../../service/media/media.service';
import { CommonModule, Location } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { StringService } from '../../../service/string/string.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavigationService } from '../../../service/navigation/navigation.service';
import { DateFormattingPipe } from '../../../pipes/date-formatting/date-formatting.pipe';
import { SecurityService } from '../../../service/security/security.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { EpisodeListComponent } from '../../components/episode-list/episode-list.component';
import { TMDB_POSTER_PATH } from '../../../shared/variables/tmdb-vars';
import { UserService } from '../../../service/user/user.service';
import { AccordionModule } from 'primeng/accordion';
import {
  SeasonTracklist,
  SeasonTracklistType,
  TVSeasonWithTracklist,
  TVWithTracklist,
} from '../../../shared/interfaces/tracklist-interfaces';

import { SelectModule } from 'primeng/select';
import { TracklistService } from '../../../service/tracklist/tracklist.service';
import { TracklistFormComponent } from '../../components/tracklist-form/tracklist-form.component';
import { UpdateTracklistFormComponent } from '../../components/update-tracklist-form/update-tracklist-form.component';
import { MenuModule } from 'primeng/menu';

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
    TracklistFormComponent,
    UpdateTracklistFormComponent,
    MenuModule,
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
  // = 0: media details; = 1: create tracklist; = 2: update tracklist
  public isTracklistFormVisible: number = 0;

  // variables for current object values
  public currentSeason: TVSeasonWithTracklist | null = null;
  public currentTracklist: SeasonTracklist | null = null;

  constructor(
    public stringService: StringService,
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private navigationService: NavigationService,
    private securityService: SecurityService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private tracklistService: TracklistService
  ) {}

  ngOnInit(): void {
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
      this.messageService.add({
        life: 7000,
        severity: 'error',
        summary: 'Fehler beim Laden der Seite',
        detail:
          'Die Seite konnte aufgrund eines Authentifizierungsfehlers nicht geladen werden. Bitte prüfe, ob du angemeldet bist und probiere es bitte erneut.',
      });

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
          selectedTracklist: [
            {
              tracklistName: '',
              tracklistId: '',
            },
          ],
        });
        this.tracklistsOfSeason = res.tracklists;
      },
      error: (err) => {
        if (err.status === 401) {
          this.userService.showLoginMessage();
        }

        this.hasError = true;
      },
    });
  }

  // functions -----------------------------------------------------

  public openTracklistForm = (season: TVSeasonWithTracklist) => {
    this.currentSeason = season;
    this.isTracklistFormVisible = 1;
  };

  public navigateToMultiSearch = () => {
    this.navigationService.navigateToMultiSearch();
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
      this.tracklistSelectionForm.get('selectedTracklist')?.setValue(
        season.tracklistsForSeason.length > 0
          ? {
              tracklistName: season.tracklistsForSeason[0].tracklistName,
              tracklistId: season.tracklistsForSeason[0].tracklistId,
            }
          : {
              tracklistName: '',
              tracklistId: -1,
            }
      );
    }

    this.selectedSeason = season;
    this.currentSeason = season;
  };

  public cancelTracklistForm = () => {
    this.isTracklistFormVisible = 0;
  };

  public setVisibility = (page: number) => {
    this.isTracklistFormVisible = page;
  };

  public setSelectedTrackilst = (tracklist: SeasonTracklistType) => {
    this.currentTracklistSelection = tracklist;
  };
}
