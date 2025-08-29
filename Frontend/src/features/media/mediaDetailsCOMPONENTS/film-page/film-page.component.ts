/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
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
import { TMDB_POSTER_PATH } from '../../../../app/shared/variables/tmdb-vars';
import { TMDB_MAIN_ROUTE } from '../../../../app/shared/variables/tmdb-route';
import { MediaTabsComponent } from "../../../sharedCOMPONENTS/media-tabs/media-tabs.component";
import { TABLIST } from '../../../../app/shared/variables/tab-lists';
import { I_APIRecommendationResponse, I_Recommendations } from '../../../../app/shared/interfaces/recommendation-interfaces';
import { RecommendationsComponent } from '../recommendations/recommendations.component';
import { ApiRecommendationComponent } from "../api-recommendation/api-recommendation.component";
import { MediaMetadataComponent } from "../media-metadata/media-metadata.component";

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
        MediaTabsComponent,
        RecommendationsComponent,
        ApiRecommendationComponent,
        MediaMetadataComponent
    ],
    templateUrl: './film-page.component.html',
    styleUrl: './film-page.component.css',
    providers: [
        UC_GetFilmDetails,
        UC_ValidateMediaURL,
        UC_ShortenString,
        UC_LogoutOfAccount
    ]
})
export class FilmPageComponent implements OnInit, OnDestroy {
    public movieID: string | null = null;
    public hasError: boolean = false;
    public serverNotAvailablePage: boolean = false;
    public isInvalidID: boolean = false;
    public currentTab: string = TABLIST[0];
    public readonly tabsList: string[] = TABLIST;

    public filmData$: Observable<Film> | null = null;
    public trackListForm!: FormGroup;
    public isTracklistSubmitted: boolean = false;
    public visibilityStatus: number = 0;
    public selectedTracklist: SeasonTracklist | null = null;
    public readonly POSTER_PATH: string = TMDB_POSTER_PATH;
    public readonly TMDB_ROUTE: string = TMDB_MAIN_ROUTE + "movie/"

    public convertStatus = convertTracklistStatusIntoGerman;

    // variable for controlling the toggle status of the tracklist panels
    public activePanel: number | null = null;

    public isLoading: boolean = false;
    public areRecommendationsLoading: boolean = false;
    public recommendations: I_Recommendations | null = null;
    public apiRecommendations: I_APIRecommendationResponse | null = null;
    private subscription: Subscription | null = null

    constructor(
        public shortenStringUseCase: UC_ShortenString,
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private location: Location,
        private router: Router,
        private validateMediaURLUseCase: UC_ValidateMediaURL,
        private getFilmDetailsUseCase: UC_GetFilmDetails,
        private logOutOfAccountUseCase: UC_LogoutOfAccount,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.movieID = params["id"]
            this.loadData(this.movieID);
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public loadData = (movieID: string | null) => {
        this.serverNotAvailablePage = false;
        this.isLoading = true;
        this.movieID = movieID;
        this.recommendations = null;
        this.apiRecommendations = null;
        this.currentTab = TABLIST[0];

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

        this.subscription = this.filmData$.subscribe({
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
        this.loadData(this.movieID);
    };

    public onChangeTab = (newTab: string) => {
        this.currentTab = newTab;
    }

    public getRecommendations = (recs: I_Recommendations) => {
        this.recommendations = recs;
    }

    public setAPIRecommendations = (recs: I_APIRecommendationResponse) => { this.apiRecommendations = recs; }
}
