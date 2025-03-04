import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { RatingModule } from 'primeng/rating';
import { DateFormattingPipe } from '../../../pipes/date-formatting/date-formatting.pipe';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { StringService } from '../../../service/string/string.service';
import { NavigationService } from '../../../service/navigation/navigation.service';
import { SecurityService } from '../../../service/security/security.service';
import { Observable } from 'rxjs';
import { Film } from '../../../shared/interfaces/media-interfaces';
import { MediaService } from '../../../service/media/media.service';
import { MEDIA_ID_NOT_EXISTS } from '../../../shared/variables/navigation-vars';
import { UserService } from '../../../service/user/user.service';
import { CreateMovieTracklistComponent } from '../../components/create-movie-tracklist/create-movie-tracklist.component';
import { SeasonTracklist } from '../../../shared/interfaces/tracklist-interfaces';
import { UpdateFilmTracklistComponent } from '../../components/update-film-tracklist/update-film-tracklist.component';
import {
  ERR_OBJECT_INVALID_AUTHENTICATION,
  getMessageObject,
} from '../../../shared/variables/message-vars';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';

@Component({
  selector: 'app-film-page',
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
    CreateMovieTracklistComponent,
    UpdateFilmTracklistComponent,
  ],
  templateUrl: './film-page.component.html',
  styleUrl: './film-page.component.css',
})
export class FilmPageComponent implements OnInit {
  public movieID: string | null = null;
  public hasError: boolean = false;
  public isInvalidID: boolean = false;

  public filmData$: Observable<Film> | null = null;
  public trackListForm!: FormGroup;
  public isTracklistSubmitted: boolean = false;
  public visibilityStatus: number = 0;
  public selectedTracklist: SeasonTracklist | null = null;

  // variable for controlling the toggle status of the tracklist panels
  public activePanel: number | null = null;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    public stringService: StringService,
    private securityService: SecurityService,
    private formBuilder: FormBuilder,
    private mediaService: MediaService,
    private location: Location,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  public loadData = () => {
    this.movieID = this.route.snapshot.paramMap.get('id');

    if (!this.movieID) {
      this.hasError = true;
      return;
    }

    if (!this.securityService.validateMediaURL(this.movieID)) {
      this.isInvalidID = true;
      return;
    }

    this.filmData$ = this.mediaService.getFilmDetails(this.movieID);

    if (!this.filmData$) {
      this.hasError = true;

      return;
    }

    this.filmData$.subscribe({
      next: (res: Film) => {
        this.trackListForm = this.formBuilder.group({
          trackListName: [res.media.name, Validators.required],
        });

        if (this.movieID?.includes(MEDIA_ID_NOT_EXISTS) && res.media.id) {
          // replacing the url with "media_id" if necessary
          this.location.replaceState(`/media/movie/${res.media.id}`);
        }
      },
      error: (err) => {
        if (err.status === 401) {
          this.userService.logoutOfAccount();
          this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
          this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
          return;
        }

        this.hasError = true;
      },
    });
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

  // dialog
  public setVisibilityStatus = (status: number) => {
    this.visibilityStatus = status;
  };

  public setSelectedTracklist = (tracklist: SeasonTracklist) => {
    this.selectedTracklist = tracklist;
    this.visibilityStatus = 2;
  };

  public refreshPage = () => {
    this.setVisibilityStatus(0);
    this.loadData();
  };
}
