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
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DateFormattingPipe } from '../../../../pipes/date-formatting/date-formatting.pipe';
import { CreateMovieTracklistComponent } from '../../tracklistCOMPONENTS/createTracklistPages/create-movie-tracklist/create-movie-tracklist.component';
import { UpdateFilmTracklistComponent } from '../../tracklistCOMPONENTS/updateTracklistPages/update-film-tracklist/update-film-tracklist.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Film } from '../../../../app/shared/interfaces/media-interfaces';
import { SeasonTracklist } from '../../../../app/shared/interfaces/tracklist-interfaces';
import { convertTracklistStatusIntoGerman } from '../../../../app/shared/variables/tracklist';
import { MEDIA_ID_NOT_EXISTS } from '../../../../app/shared/variables/navigation-vars';
import { ERR_OBJECT_INVALID_AUTHENTICATION } from '../../../../app/shared/variables/message-vars';
import { ROUTES_LIST } from '../../../../app/shared/variables/routes-list';
import { UC_ShortenString } from '../../../../app/core/use-cases/string/shorten-string.use-case';
import { UC_ValidateMediaURL } from '../../../../app/core/use-cases/security/validate-media-url.use-case';
import { UC_GetFilmDetails } from '../../../../app/core/use-cases/media/get-film-details.use-case';
import { UC_LogoutOfAccount } from '../../../../app/core/use-cases/user/log-out-of-account.use-case';

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
        ProgressSpinnerModule,
    ],
    templateUrl: './film-page.component.html',
    styleUrl: './film-page.component.css',
    providers: [UC_GetFilmDetails, UC_ValidateMediaURL, UC_ShortenString, UC_LogoutOfAccount]
})
export class FilmPageComponent implements OnInit {
    public movieID: string | null = null;
    public hasError: boolean = false;
    public serverNotAvailablePage: boolean = false;
    public isInvalidID: boolean = false;

    public filmData$: Observable<Film> | null = null;
    public trackListForm!: FormGroup;
    public isTracklistSubmitted: boolean = false;
    public visibilityStatus: number = 0;
    public selectedTracklist: SeasonTracklist | null = null;

    public convertStatus = convertTracklistStatusIntoGerman;

    // variable for controlling the toggle status of the tracklist panels
    public activePanel: number | null = null;

    public isLoading: boolean = false;

    constructor(
        public shortenStringUseCase: UC_ShortenString,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private location: Location,
        private router: Router,
        private validateMediaURLUseCase: UC_ValidateMediaURL,
        private getFilmDetailsUseCase: UC_GetFilmDetails,
        private logOutOfAccountUseCase: UC_LogoutOfAccount
    ) { }

    ngOnInit(): void {
        this.loadData();
    }

    public loadData = () => {
        this.serverNotAvailablePage = false;
        this.isLoading = true;
        this.movieID = this.route.snapshot.paramMap.get('id');

        if (!this.movieID) {
            this.hasError = true;
            return;
        }

        if (!this.validateMediaURLUseCase.execute(this.movieID)) {
            this.isInvalidID = true;
            return;
        }

        this.filmData$ = this.getFilmDetailsUseCase.execute(this.movieID);

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

                this.isLoading = false;
            },
            error: (err) => {
                if (err.status === 401) {
                    this.logOutOfAccountUseCase.execute();
                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                    return;
                } else if (err.status === 0) {
                    this.serverNotAvailablePage = true;
                }

                this.hasError = true;
                this.isLoading = false;
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
