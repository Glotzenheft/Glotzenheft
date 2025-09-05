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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Film } from '../../../../app/shared/interfaces/media-interfaces';
import {
    I_TracklistFormOutput,
    SeasonTracklist,
    Tracklist,
} from '../../../../app/shared/interfaces/tracklist-interfaces';
import { convertTracklistStatusIntoGerman } from '../../../../app/shared/variables/tracklist';
import { MEDIA_ID_NOT_EXISTS } from '../../../../app/shared/variables/navigation-vars';
import {
    ERR_OBJECT_INVALID_AUTHENTICATION,
    getMessageObject,
} from '../../../../app/shared/variables/message-vars';
import { ROUTES_LIST } from '../../../../app/shared/variables/routes-list';
import { UC_ShortenString } from '../../../../app/core/use-cases/string/shorten-string.use-case';
import { UC_ValidateMediaURL } from '../../../../app/core/use-cases/security/validate-media-url.use-case';
import { UC_GetFilmDetails } from '../../../../app/core/use-cases/media/get-film-details.use-case';
import { UC_LogoutOfAccount } from '../../../../app/core/use-cases/user/log-out-of-account.use-case';
import { TMDB_POSTER_PATH } from '../../../../app/shared/variables/tmdb-vars';
import { TMDB_MAIN_ROUTE } from '../../../../app/shared/variables/tmdb-route';
import { MediaTabsComponent } from '../../../sharedCOMPONENTS/media-tabs/media-tabs.component';
import { TABLIST } from '../../../../app/shared/variables/tab-lists';
import {
    I_APIRecommendationResponse,
    I_Recommendations,
} from '../../../../app/shared/interfaces/recommendation-interfaces';
import { RecommendationsComponent } from '../recommendations/recommendations.component';
// import { ApiRecommendationComponent } from "../api-recommendation/api-recommendation.component";
import { MediaMetadataComponent } from '../media-metadata/media-metadata.component';
import { UC_NavigateToSpecificPage } from '../../../../app/core/use-cases/navigation/navigate-to-specific-page.use-case';
import { UC_getTracklistCREATEMOVIESubjectResponse } from '../../../../app/core/use-cases/media/get-tracklist-create-movie-subject-response.use-case';
import { UC_TriggerTracklistCREATEMOVIESubject } from '../../../../app/core/use-cases/media/trigger-tracklist-create-movie-subject.use-case';
import { TracklistFormularComponent } from '../tracklist-formular/tracklist-formular.component';
import { UC_GetTracklistUPDATEResponseSubject } from '../../../../app/core/use-cases/media/get-tracklist-update-response-subject.use-case';
import { UC_GetTracklistDELETEResponseSubject } from '../../../../app/core/use-cases/media/get-tracklist-delete-response-subject.use-case';
import { UC_TriggerTracklistUPDATESubject } from '../../../../app/core/use-cases/media/trigger-tracklist-update.subject.use-case';
import { UC_TriggerTracklistDELETESubject } from '../../../../app/core/use-cases/media/trigger-tracklist-delete-subject.use-case';

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
        ProgressSpinnerModule,
        MediaTabsComponent,
        RecommendationsComponent,
        // ApiRecommendationComponent,
        MediaMetadataComponent,
        TracklistFormularComponent,
    ],
    templateUrl: './film-page.component.html',
    styleUrl: './film-page.component.css',
    providers: [
        UC_GetFilmDetails,
        UC_ValidateMediaURL,
        UC_ShortenString,
        UC_LogoutOfAccount,
        UC_NavigateToSpecificPage,
        UC_getTracklistCREATEMOVIESubjectResponse,
        UC_TriggerTracklistCREATEMOVIESubject,
        UC_GetTracklistUPDATEResponseSubject,
        UC_GetTracklistDELETEResponseSubject,
        UC_TriggerTracklistDELETESubject,
        UC_TriggerTracklistUPDATESubject,
    ],
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
    public readonly TMDB_ROUTE: string = TMDB_MAIN_ROUTE + 'movie/';

    public convertStatus = convertTracklistStatusIntoGerman;

    // variable for controlling the toggle status of the tracklist panels
    public activePanel: number | null = null;

    public isLoading: boolean = false;
    public areRecommendationsLoading: boolean = false;
    public recommendations: I_Recommendations | null = null;
    public apiRecommendations: I_APIRecommendationResponse | null = null;
    private subscription: Subscription | null = null;
    private createSubscription: Subscription | null = null;
    private updateSubscription: Subscription | null = null;
    private deleteSubscription: Subscription | null = null;

    constructor(
        public readonly shortenStringUseCase: UC_ShortenString,
        private readonly messageService: MessageService,
        private readonly formBuilder: FormBuilder,
        private readonly location: Location,
        private readonly validateMediaURLUseCase: UC_ValidateMediaURL,
        private readonly getFilmDetailsUseCase: UC_GetFilmDetails,
        private readonly logoutOfAccountUseCase: UC_LogoutOfAccount,
        private readonly activatedRoute: ActivatedRoute,
        private readonly navigateToSpecificPageUseCase: UC_NavigateToSpecificPage,
        private readonly getTracklistCREATEMOVIESubjectResponseUseCase: UC_getTracklistCREATEMOVIESubjectResponse,
        private readonly triggerTracklistCREATEMOVIESubjectUseCase: UC_TriggerTracklistCREATEMOVIESubject,
        private readonly getTracklistUPDATEResponseSubjectUseCase: UC_GetTracklistUPDATEResponseSubject,
        private readonly getTracklistDELETEReponseSubjectUseCase: UC_GetTracklistDELETEResponseSubject,
        private readonly triggerTracklistUPDATESubjectUseCase: UC_TriggerTracklistUPDATESubject,
        private readonly triggerTracklistDELETEsubjectUseCase: UC_TriggerTracklistDELETESubject,
    ) {}

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.movieID = params['id'];
            this.loadData(this.movieID);
        });

        this.createSubscription =
            this.getTracklistCREATEMOVIESubjectResponseUseCase
                .execute()
                .subscribe({
                    next: () => {
                        this.messageService.add(
                            getMessageObject(
                                'success',
                                'Tracklist erfolgreich angelegt',
                            ),
                        );
                        this.refreshPage();
                    },
                    error: (err) => {
                        if (err.status === 401) {
                            // status 401 = user is not logged in anymore -> navigate to login page
                            this.logoutOfAccountUseCase.execute();
                            this.messageService.add(
                                ERR_OBJECT_INVALID_AUTHENTICATION,
                            );
                            void this.navigateToSpecificPageUseCase.execute(
                                ROUTES_LIST[10].fullUrl,
                            );
                            return;
                        }

                        this.messageService.add(
                            getMessageObject(
                                'error',
                                'Fehler beim Anlegen der Tracklist',
                            ),
                        );
                    },
                });

        this.updateSubscription = this.getTracklistUPDATEResponseSubjectUseCase
            .execute()
            .subscribe({
                next: () => {
                    this.messageService.add(
                        getMessageObject(
                            'success',
                            'Tracklist erfolgreich gespeichert',
                        ),
                    );
                    this.refreshPage();
                },
                error: (err) => {
                    if (err.status === 401) {
                        this.logoutOfAccountUseCase.execute();
                        this.messageService.add(
                            ERR_OBJECT_INVALID_AUTHENTICATION,
                        );
                        this.navigateToSpecificPageUseCase.execute(
                            ROUTES_LIST[10].fullUrl,
                        );
                        return;
                    }

                    this.messageService.add(
                        getMessageObject(
                            'error',
                            'Fehler beim Speichern der Tracklist',
                        ),
                    );
                },
            });

        this.deleteSubscription = this.getTracklistDELETEReponseSubjectUseCase
            .execute()
            .subscribe({
                next: () => {
                    this.messageService.add(
                        getMessageObject(
                            'success',
                            'Tracklist erfolgreich gelöscht',
                        ),
                    );
                    this.refreshPage();
                },
                error: (err) => {
                    if (err.status === 401) {
                        this.logoutOfAccountUseCase.execute();
                        this.messageService.add(
                            ERR_OBJECT_INVALID_AUTHENTICATION,
                        );
                        this.navigateToSpecificPageUseCase.execute(
                            ROUTES_LIST[10].fullUrl,
                        );
                        return;
                    }

                    this.messageService.add(
                        getMessageObject(
                            'error',
                            'Fehler beim Löschen der Tracklist',
                        ),
                    );
                },
            });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
        this.createSubscription?.unsubscribe();
        this.updateSubscription?.unsubscribe();
        this.deleteSubscription?.unsubscribe();
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

                if (
                    this.movieID?.includes(MEDIA_ID_NOT_EXISTS) &&
                    res.media.id
                ) {
                    // replacing the url with "media_id" if necessary
                    this.location.replaceState(`/media/movie/${res.media.id}`);
                }

                this.isLoading = false;
            },
            error: (err) => {
                if (err.status === 401) {
                    this.logoutOfAccountUseCase.execute();
                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    this.navigateToSpecificPageUseCase.execute(
                        ROUTES_LIST[10].fullUrl,
                    );
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
    };

    public getRecommendations = (recs: I_Recommendations) => {
        this.recommendations = recs;
    };

    public setAPIRecommendations = (recs: I_APIRecommendationResponse) => {
        this.apiRecommendations = recs;
    };

    public getTracklistNumber = (tracklistNumber: number): number => {
        return tracklistNumber + 1;
    };

    public getDefaultTracklist = (tracklistName: string): Tracklist => {
        return {
            id: 0,
            rating: null,
            status: 'watching',
            startDate: null,
            finishDate: null,
            tracklistName: tracklistName,
            media: {
                id: 0,
                type: '',
                posterPath: '',
            },
            tracklistSeasons: [],
            isRewatching: false,
        };
    };

    public createNewTracklist = (
        event: I_TracklistFormOutput,
        mediaId: number,
    ) => {
        this.triggerTracklistCREATEMOVIESubjectUseCase.execute({
            tracklist_name: event.tracklistName,
            media_id: mediaId,
            tracklist_start_date: event.startDate,
            tracklist_finish_date: event.finishDate,
            tracklist_status: event.status,
            tracklist_rating: event.rating,
            is_rewatching: event.isRewatching,
            media_type: 'movie',
        });
    };

    public updateTracklist = (
        event: I_TracklistFormOutput,
        selectedTracklist: SeasonTracklist,
    ) => {
        this.triggerTracklistUPDATESubjectUseCase.execute({
            tracklist_id: selectedTracklist.id,
            tracklist_status: event.status,
            tracklist_name: event.tracklistName,
            is_rewatching: event.isRewatching,
            tracklist_finish_date: event.finishDate,
            tracklist_start_date: event.startDate,
            tracklist_rating: event.rating,
        });
    };

    public deleteTracklist = (tracklistId: number) => {
        this.triggerTracklistDELETEsubjectUseCase.execute(tracklistId);
    };

    public cancelTracklist = () => {
        this.setVisibilityStatus(0);
    };
}
