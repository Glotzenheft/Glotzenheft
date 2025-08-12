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
along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

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
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DateFormattingPipe } from '../../../../pipes/date-formatting/date-formatting.pipe';
import { CreateMovieTracklistComponent } from '../../tracklistCOMPONENTS/createTracklistPages/create-movie-tracklist/create-movie-tracklist.component';
import { UpdateFilmTracklistComponent } from '../../tracklistCOMPONENTS/updateTracklistPages/update-film-tracklist/update-film-tracklist.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Film, MediaIDResponse } from '../../../../app/shared/interfaces/media-interfaces';
import { SeasonTracklist } from '../../../../app/shared/interfaces/tracklist-interfaces';
import { convertTracklistStatusIntoGerman } from '../../../../app/shared/variables/tracklist';
import { MEDIA_ID_NOT_EXISTS } from '../../../../app/shared/variables/navigation-vars';
import { ERR_OBJECT_INVALID_AUTHENTICATION, getMessageObject } from '../../../../app/shared/variables/message-vars';
import { ROUTES_LIST } from '../../../../app/shared/variables/routes-list';
import { UC_ShortenString } from '../../../../app/core/use-cases/string/shorten-string.use-case';
import { UC_ValidateMediaURL } from '../../../../app/core/use-cases/security/validate-media-url.use-case';
import { UC_GetFilmDetails } from '../../../../app/core/use-cases/media/get-film-details.use-case';
import { UC_LogoutOfAccount } from '../../../../app/core/use-cases/user/log-out-of-account.use-case';
import { TMDB_POSTER_PATH } from '../../../../app/shared/variables/tmdb-vars';
import { TMDB_MAIN_ROUTE } from '../../../../app/shared/variables/tmdb-route';
import { I_MovieRecommendations } from '../../../../app/shared/interfaces/movie-recommendation-interface';
import { UC_GetMovieRecommendations } from '../../../../app/core/use-cases/media/get-movie-recommendations.use-case';
import { UC_NavigateToPage } from '../../../../app/core/use-cases/navigation/navigate-to-page.use-case';
import { UC_GetMediaIdForMedia } from '../../../../app/core/use-cases/media/get-media-id-for-media.use-case';
import { UC_ShowLoginMessage } from '../../../../app/core/use-cases/user/show-login-message.use-case';

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
    providers: [
        UC_GetFilmDetails,
        UC_ValidateMediaURL,
        UC_ShortenString,
        UC_LogoutOfAccount,
        UC_GetMovieRecommendations,
        UC_NavigateToPage,
        UC_GetMediaIdForMedia,
        UC_ShowLoginMessage
    ]
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
    public readonly POSTER_PATH: string = TMDB_POSTER_PATH;
    public readonly TMDB_ROUTE: string = TMDB_MAIN_ROUTE + "movie/"

    public convertStatus = convertTracklistStatusIntoGerman;

    // variable for controlling the toggle status of the tracklist panels
    public activePanel: number | null = null;

    public isLoading: boolean = false;
    public areRecommendationsLoading: boolean = false;
    public recommendations: I_MovieRecommendations | null = null;
    private subscription: Subscription | null = null

    constructor(
        public shortenStringUseCase: UC_ShortenString,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private location: Location,
        private router: Router,
        private validateMediaURLUseCase: UC_ValidateMediaURL,
        private getFilmDetailsUseCase: UC_GetFilmDetails,
        private logOutOfAccountUseCase: UC_LogoutOfAccount,
        private getMovieRecommendationsUseCase: UC_GetMovieRecommendations,
        private navigateToPageUseCase: UC_NavigateToPage,
        private getMediaIdForMediaUseCase: UC_GetMediaIdForMedia,
        private showLoginMessageUseCase: UC_ShowLoginMessage,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.movieID = params["id"]
            this.loadData(this.movieID);
        })
    }

    public loadData = (movieID: string | null) => {
        this.serverNotAvailablePage = false;
        this.isLoading = true;
        this.movieID = this.route.snapshot.paramMap.get('id');
        this.recommendations = null;

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
        this.loadData(this.movieID);
    };


    public getMovieRecommendations = (movieId: number, movieTitle: string) => {
        this.areRecommendationsLoading = true;
        this.subscription = this.getMovieRecommendationsUseCase.execute(movieId, movieTitle).subscribe({
            next: (response: I_MovieRecommendations) => {
                this.recommendations = response
                this.areRecommendationsLoading = false;
            },
            error: (err) => {
                if (err.status === 401 || err.status === 400) {
                    this.logOutOfAccountUseCase.execute();
                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                    return;
                } else if (err.status === 0) {
                    this.serverNotAvailablePage = true;
                }

                // this.hasError = true;
                this.areRecommendationsLoading = false;
            },
        });
    }

    public navigateToMediaPage = (tmdbId: number, isMovie: boolean) => {
        this.getMediaIdForMediaUseCase.execute(tmdbId, isMovie).subscribe({
            next: (res: MediaIDResponse) => {
                if (res.media_id === undefined || res.media_id === null) {
                    // if no media_id exists in the db -> because media is not already saved
                    const summaryMessage: string = `Fehler beim Weiterleiten ${isMovie ? 'zum Film.' : 'zur Serie'
                        }`;

                    this.messageService.add(
                        getMessageObject(
                            'error',
                            summaryMessage,
                            'Bitte lade die Seite erneut und versuche es noch einmal.'
                        )
                    );
                    return;
                }

                this.navigateToPageUseCase.execute(res.media_id, isMovie);
            },
            error: (err) => {
                if (err.status === 401) {
                    // 401 = user token is not logged in anymore -> navigate to login page
                    this.showLoginMessageUseCase.execute();
                    this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                    return;
                }

                const message: string = `Fehler beim Weiterleiten ${isMovie ? 'zum Film.' : 'zur Serie.'
                    }`;

                this.messageService.add(
                    getMessageObject(
                        'error',
                        message,
                        'Bitte lade die Seite und versuche es erneut.'
                    )
                );
            }
        })
    }
}
