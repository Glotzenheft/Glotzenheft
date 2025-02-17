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
import { CreateNewTracklistComponent } from '../../components/create-new-tracklist/create-new-tracklist.component';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { StringService } from '../../../service/string/string.service';
import { NavigationService } from '../../../service/navigation/navigation.service';
import { SecurityService } from '../../../service/security/security.service';
import { Observable } from 'rxjs';
import { Film } from '../../../shared/interfaces/media-interfaces';
import { MediaService } from '../../../service/media/media.service';
import { MEDIA_ID_NOT_EXISTS } from '../../../shared/variables/navigation-vars';
import { UserService } from '../../../service/user/user.service';

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
    CreateNewTracklistComponent,
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
  public isTracklistDialogVisible: boolean = false;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    public stringService: StringService,
    private navigationService: NavigationService,
    private securityService: SecurityService,
    private formBuilder: FormBuilder,
    private mediaService: MediaService,
    private location: Location,
    private userService: UserService
  ) {}

  ngOnInit(): void {
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
    }

    this.filmData$.subscribe({
      next: (res: Film) => {
        this.trackListForm = this.formBuilder.group({
          trackListName: [res.name, Validators.required],
        });

        if (this.movieID?.includes(MEDIA_ID_NOT_EXISTS) && res.id) {
          // replacing the url with "media_id" if necessary
          this.location.replaceState(`/media/movie/${res.id}`);
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

  public hasErrorField = (field: string) => {
    const fieldControl = this.trackListForm.get(field);

    return (
      fieldControl! &&
      (fieldControl!.dirty ||
        fieldControl!.touched ||
        this.isTracklistSubmitted)
    );
  };

  // navigation
  public navigateToMultiSearch = () => {
    this.navigationService.navigateToMultiSearch();
  };

  // dialog
  public openTracklistDialog = () => {
    this.isTracklistDialogVisible = true;
  };
}
