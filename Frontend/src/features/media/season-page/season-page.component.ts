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
  TVSeasonWithTracklist,
  TVWithTracklist,
} from '../../../shared/interfaces/tracklist-interfaces';

import { SelectModule } from 'primeng/select';
import { TracklistService } from '../../../service/tracklist/tracklist.service';
import { TracklistFormComponent } from '../../components/tracklist-form/tracklist-form.component';

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

  // dialog and visibility variables
  public isTracklistFormVisible: boolean = false;

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
          selectedTracklist: [{ tracklistName: '', tracklistId: -1 }],
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

  public showEpisodeDialog = (season: SeasonWithEpisodes) => {
    this.isTracklistFormVisible = true;

    this.visibleSeason = season;
  };

  public saveEpisode = (season: SeasonWithEpisodes) => {
    this.isTracklistFormVisible = false;
  };

  public closeEpisodeDialog = () => {
    this.isTracklistFormVisible = false;
  };

  public openTracklistForm = (season: TVSeasonWithTracklist) => {
    this.currentSeason = season;
    this.isTracklistFormVisible = true;
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
    this.selectedSeason = season;

    const selectedTracklistFull: SeasonTracklist[] =
      this.tracklistsOfSeason.filter((tracklist: SeasonTracklist) => {
        return (
          tracklist.id ===
          this.tracklistSelectionForm.get('selectedTracklist')?.value
            .tracklistId
        );
      });
  };

  public cancelTracklistForm = () => {
    this.isTracklistFormVisible = false;
  };
}
