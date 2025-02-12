import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Season,
  SeasonWithEpisodes,
} from '../../../shared/interfaces/media-interfaces';
import { Observable, of } from 'rxjs';
import { MediaService } from '../../../service/media/media.service';
import { CommonModule } from '@angular/common';
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
  ],
  templateUrl: './season-page.component.html',
  styleUrl: './season-page.component.css',
})
export class SeasonPageComponent implements OnInit {
  public seasonID: string | null = null;
  public tvSeriesID: string | null = null;
  public seasonData$: Observable<Season> | null = null;
  public episodeRating: number = 0;

  public hasError: boolean = false;
  public isInvalidID: boolean = false;
  public isDialogVisible: boolean = false;
  public visibleSeason: SeasonWithEpisodes | null = null;
  public isTracklistDialogVisible: boolean = false;

  public trackListForm!: FormGroup;

  constructor(
    public stringService: StringService,
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private navigationService: NavigationService,
    private securityService: SecurityService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.tvSeriesID = this.route.snapshot.paramMap.get('id');

    if (!this.tvSeriesID) {
      this.hasError = true;
      if (!this.seasonID) {
      }
      return;
    }

    if (!this.securityService.validateMediaURL(this.tvSeriesID)) {
      this.isInvalidID = true;
      return;
    }

    const isMovie: boolean = this.tvSeriesID.split('_')[1].trim() === 'movie';

    this.seasonData$ = this.mediaService.getSeasonForTV(
      this.tvSeriesID,
      isMovie
    );

    if (!this.seasonData$) {
      this.hasError = true;
    }

    this.seasonData$.subscribe({
      error: (err) => {
        this.hasError = true;
      },
    });

    this.trackListForm = this.formBuilder.group({
      trackListName: ['', Validators.required],
    });
  }

  showEpisodeDialog = (season: SeasonWithEpisodes) => {
    this.isDialogVisible = true;

    this.visibleSeason = season;
  };

  saveEpisode = (season: SeasonWithEpisodes) => {
    this.isDialogVisible = false;
  };

  closeEpisodeDialog = () => {
    this.isDialogVisible = false;
  };

  public openTracklistDialog = () => {
    this.isTracklistDialogVisible = true;
  };

  navigateToMultiSearch = () => {
    this.navigationService.navigateToMultiSearch();
  };

  public createNewTrackList = (id: number, name: string) => {
    if (this.trackListForm.invalid) {
      this.messageService.add({
        life: 7000,
        summary: 'Ungültiger Name',
        detail: 'Der Name der Tracklist darf nicht leer sein.',
        severity: 'error',
      });
    }

    this.mediaService.createNewTracklist({
      name,
      tmdbId: id,
    });
  };
}
