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
import { CreateNewTracklistComponent } from '../../components/create-new-tracklist/create-new-tracklist.component';
import { MEDIA_ID_NOT_EXISTS } from '../../../shared/variables/navigation-vars';
import { EpisodeListComponent } from '../../components/episode-list/episode-list.component';
import { TMDB_POSTER_PATH } from '../../../shared/variables/tmdb-vars';
import { UserService } from '../../../service/user/user.service';
import { AccordionModule } from 'primeng/accordion';

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
    CreateNewTracklistComponent,
    EpisodeListComponent,
    AccordionModule,
  ],
  templateUrl: './season-page.component.html',
  styleUrl: './season-page.component.css',
})
export class SeasonPageComponent implements OnInit {
  public tvSeriesID: string | null = null;
  public seasonData$: Observable<Season> | null = null;
  public episodeRating: number = 0;
  public posterPath: string = TMDB_POSTER_PATH;

  public hasError: boolean = false;
  public isInvalidID: boolean = false;
  public isDialogVisible: boolean = false;
  public visibleSeason: SeasonWithEpisodes | null = null;
  public isTracklistDialogVisible: boolean = false;
  public currentSeasonID: number | null = null;
  public currentSeasonName: string | null = null;

  public trackListForm!: FormGroup;
  public isTracklistSubmitted: boolean = false;

  constructor(
    public stringService: StringService,
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private navigationService: NavigationService,
    private securityService: SecurityService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private location: Location,
    private userService: UserService
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
        // if (res.id && res.id.toString() !== splittedURL[1].trim()) {
        //   this.location.replaceState(
        //     `/media/${res.id}_${splittedURL[1].trim()}`
        //   );
        // }

        this.trackListForm = this.formBuilder.group({
          trackListName: [res.media.name, Validators.required],
        });

        if (this.tvSeriesID?.includes(MEDIA_ID_NOT_EXISTS) && res.media.id) {
          // replacing the url with "media_id" if necessary
          this.location.replaceState(`/media/tv/${res.media.id}`);
        }
      },
      error: (err) => {
        if (err.status === 401) {
          this.userService.showLoginMessage();
        }

        this.hasError = true;
      },
    });
  }

  public showEpisodeDialog = (season: SeasonWithEpisodes) => {
    this.isDialogVisible = true;

    this.visibleSeason = season;
  };

  public saveEpisode = (season: SeasonWithEpisodes) => {
    this.isDialogVisible = false;
  };

  public closeEpisodeDialog = () => {
    this.isDialogVisible = false;
  };

  public openTracklistDialog = (seasonID: number, seasonName: string) => {
    this.currentSeasonID = seasonID;
    this.currentSeasonName = seasonName;
    this.isTracklistDialogVisible = true;
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
}
