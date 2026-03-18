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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { map, Observable, Subscription } from 'rxjs';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { SelectModule } from 'primeng/select';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { DateFormattingPipe } from '../../../../pipes/date-formatting/date-formatting.pipe';
import { EpisodeListComponent } from '../../episodesCOMPONENTS/episode-list/episode-list.component';
import { MenuModule } from 'primeng/menu';
import { CreateTracklistEpisodeFormComponent } from '../../episodesCOMPONENTS/tracklist-episodes/create-tracklist-episode-form/create-tracklist-episode-form.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {
    Season,
    SeasonEpisode,
    SeasonWithEpisodes,
} from '../../../../app/shared/interfaces/media-interfaces';
import {
    I_TracklistFormOutput,
    SeasonTracklist,
    SeasonTracklistType,
    Tracklist,
    TVSeasonWithTracklist,
    TVWithTracklist,
} from '../../../../app/shared/interfaces/tracklist-interfaces';
import {
    TMDB_POSTER_PATH,
    TMDB_ORIGINAL_IMAGE_PATH,
} from '../../../../app/shared/variables/tmdb-vars';
import {
    ERR_OBJECT_INVALID_AUTHENTICATION,
    getMessageObject,
} from '../../../../app/shared/variables/message-vars';
import { ROUTES_LIST } from '../../../../app/shared/variables/routes-list';
import { UC_GetSeasonForTV } from '../../../../app/core/use-cases/media/get-season-for-tv.use-case';
import { UC_ValidateMediaURL } from '../../../../app/core/use-cases/security/validate-media-url.use-case';
import { UC_LogoutOfAccount } from '../../../../app/core/use-cases/user/log-out-of-account.use-case';
import { UC_JoinTVWithTracklists } from '../../../../app/core/use-cases/tracklist/join-tv-with-tracklists.use-case';
import { UC_GetSelectedTracklistInLocalStorage } from '../../../../app/core/use-cases/tracklist/get-selected-tracklist-in-local-storage.use-case';
import { TMDB_MAIN_ROUTE } from '../../../../app/shared/variables/tmdb-route';
import { TABLIST } from '../../../../app/shared/variables/tab-lists';
import { MediaTabsComponent } from '../../../sharedCOMPONENTS/media-tabs/media-tabs.component';
import { I_APIRecommendationResponse } from '../../../../app/shared/interfaces/recommendation-interfaces';
import { ApiRecommendationComponent } from '../api-recommendation/api-recommendation.component';
import { TooltipModule } from 'primeng/tooltip';
import { MediaMetadataComponent } from '../media-metadata/media-metadata.component';
import { TracklistFormularComponent } from '../tracklist-formular/tracklist-formular.component';
import { UC_NavigateToSpecificPage } from '../../../../app/core/use-cases/navigation/navigate-to-specific-page.use-case';
import { UC_GetTracklistCREATESEASONResponseSubject } from '../../../../app/core/use-cases/media/get-tracklist-create-season-response-subject.use-case';
import { UC_TriggerTracklistCREATESEASONSubject } from '../../../../app/core/use-cases/media/trigger-tracklist-create-season-subject.use-case';
import { UC_SetSelectedTracklistInLocalStorage } from '../../../../app/core/use-cases/tracklist/set-selected-tracklist-in-local-storage.use-case';
import { UC_GetTracklistUPDATEResponseSubject } from '../../../../app/core/use-cases/media/get-tracklist-update-response-subject.use-case';
import { UC_GetTracklistDELETEResponseSubject } from '../../../../app/core/use-cases/media/get-tracklist-delete-response-subject.use-case';
import { UC_TriggerTracklistUPDATESubject } from '../../../../app/core/use-cases/media/trigger-tracklist-update.subject.use-case';
import { UC_TriggerTracklistDELETESubject } from '../../../../app/core/use-cases/media/trigger-tracklist-delete-subject.use-case';
import {Tag} from 'primeng/tag';
import {Image} from 'primeng/image';
import {Checkbox} from 'primeng/checkbox';

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
        MenuModule,
        CreateTracklistEpisodeFormComponent,
        ProgressSpinnerModule,
        MediaTabsComponent,
        TooltipModule,
        ApiRecommendationComponent,
        MediaMetadataComponent,
        TracklistFormularComponent,
        Tag,
        Image,
        NgOptimizedImage,
        Checkbox,
    ],
    templateUrl: './season-page.component.html',
    styleUrl: './season-page.component.css',
    providers: [
        UC_GetSeasonForTV,
        UC_ValidateMediaURL,
        UC_GetSelectedTracklistInLocalStorage,
        UC_JoinTVWithTracklists,
        UC_LogoutOfAccount,
        UC_NavigateToSpecificPage,
        UC_SetSelectedTracklistInLocalStorage,
        UC_TriggerTracklistCREATESEASONSubject,
        UC_GetTracklistCREATESEASONResponseSubject,
        UC_GetTracklistUPDATEResponseSubject,
        UC_GetTracklistDELETEResponseSubject,
        UC_TriggerTracklistUPDATESubject,
        UC_TriggerTracklistDELETESubject,
    ],
})
//todo rename to Series
export class SeasonPageComponent implements OnInit, OnDestroy {
    public tvSeriesId: string | null = null;
    public seasonData$: Observable<Season> | null = null;
    public numberOfEpisodes$: Observable<number> | null = null;
    public tvDataWithTracklist: TVWithTracklist | null = null;

    public episodeRating: number = 0;
    public readonly POSTER_PATH: string = TMDB_POSTER_PATH;
    public originalPosterPath: string = TMDB_ORIGINAL_IMAGE_PATH;
    public isThumbnailLoading = true;
    public imageError = false;

    public readonly TMDB_ROUTE: string = TMDB_MAIN_ROUTE + 'tv/';
    public currentTab: string = TABLIST[0];
    public tabList: string[] = TABLIST;
    public apiRecommendations: I_APIRecommendationResponse | null = null;
    public hasError: boolean = false;
    public serverNotAvailablePage: boolean = false;
    public isInvalidID: boolean = false;
    public visibleSeason: SeasonWithEpisodes | null = null;
    public selectedSeason: TVSeasonWithTracklist | null = null;
    public tracklistsOfSeason: SeasonTracklist[] = [];
    public trackListForm!: FormGroup;
    public isTracklistSubmitted: boolean = false;
    public tracklistSelectionForm!: FormGroup;
    public currentTracklistSelection: SeasonTracklistType | null = null;

    // dialog and visibility variables --------------------------
    // = 0: media details; = 1: create tracklist; = 2: update tracklist; = 3: add new episode to current tracklist; = 4: edit episode of current tracklist
    public isTracklistFormVisible: number = 0;

    // variables for current object values
    public currentSeason: TVSeasonWithTracklist | null = null;
    public currentTracklist: SeasonTracklist | null = null;
    public currentEpisode: SeasonEpisode | null = null;

    public isEditingButtonVisible: boolean = true;
    public isLoading: boolean = false;
    private createSubscription: Subscription | null = null;
    private updateSubscription: Subscription | null = null;
    private deleteSubscription: Subscription | null = null;
    private seasonDataSubscription: Subscription | null = null;

    constructor(
        private titleService: Title,
        private readonly route: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
        private readonly messageService: MessageService,
        private readonly getSeasonForTVUseCase: UC_GetSeasonForTV,
        private readonly validateMediaURLUseCase: UC_ValidateMediaURL,
        private readonly logoutOfAccountUseCase: UC_LogoutOfAccount,
        private readonly joinTVWithTracklistsUseCase: UC_JoinTVWithTracklists,
        private readonly getSelectedTracklistsInLocalStorageUseCase: UC_GetSelectedTracklistInLocalStorage,
        private readonly navigateToSpecificPageUseCase: UC_NavigateToSpecificPage,
        private readonly getTracklistCREATESEASONResponseSubjectUseCase: UC_GetTracklistCREATESEASONResponseSubject,
        private readonly triggerTracklistCREATESEASONSubjectUseCase: UC_TriggerTracklistCREATESEASONSubject,
        private readonly setSelectedTracklistInLocalStorageUseCase: UC_SetSelectedTracklistInLocalStorage,
        private readonly getTracklistUPDATEResponseSubjectUseCase: UC_GetTracklistUPDATEResponseSubject,
        private readonly getTracklistDELETEResponseSubjectUseCase: UC_GetTracklistDELETEResponseSubject,
        private readonly triggerTracklistUPDATESubjectUseCase: UC_TriggerTracklistUPDATESubject,
        private readonly triggerTracklistDELETESubjectUseCase: UC_TriggerTracklistDELETESubject,
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.tvSeriesId = params['id'];
            this.loadData(this.tvSeriesId);
        });

        this.createSubscription =
            this.getTracklistCREATESEASONResponseSubjectUseCase
                .execute()
                .subscribe({
                    next: (response: Tracklist) => {
                        this.messageService.add(
                            getMessageObject(
                                'success',
                                'Tracklist erfolgreich angelegt',
                            ),
                        );
                        this.setSelectedTracklistInLocalStorageUseCase.execute(
                            response.id,
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
                                'Bitte lade die Seite neu und probiere es erneut.',
                            ),
                        );
                    },
                });

        this.updateSubscription = this.getTracklistUPDATEResponseSubjectUseCase
            .execute()
            .subscribe({
                next: (res: Tracklist) => {
                    this.messageService.add(
                        getMessageObject(
                            'success',
                            'Tracklist erfolgreich gespeichert',
                        ),
                    );
                    this.setSelectedTracklistInLocalStorageUseCase.execute(
                        res.id,
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
                            'Fehler beim Speichern der Tracklist',
                            'Bitte lade die Seite neu und probiere es erneut.',
                        ),
                    );
                },
            });

        this.deleteSubscription = this.getTracklistDELETEResponseSubjectUseCase
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
                            'Fehler beim Löschen der Tracklist',
                            'Bitte lade die Seite neu und probiere es erneut.',
                        ),
                    );
                },
            });
    }

    ngOnDestroy(): void {
        this.createSubscription?.unsubscribe();
        this.updateSubscription?.unsubscribe();
        this.deleteSubscription?.unsubscribe();
        this.seasonDataSubscription?.unsubscribe();
    }

    // functions -----------------------------------------------------

    public loadData = (tmdbId: string | null) => {
        this.serverNotAvailablePage = false;
        this.isLoading = true;
        this.apiRecommendations = null;
        this.currentTab = TABLIST[0];

        if (!tmdbId) {
            this.hasError = true;
            return;
        }

        if (!this.validateMediaURLUseCase.execute(tmdbId)) {
            this.isInvalidID = true;
            return;
        }

        // checking if "media_id" already exists:
        this.seasonData$ = this.getSeasonForTVUseCase.execute(tmdbId);
        this.numberOfEpisodes$ =
            this.seasonData$ &&
            this.seasonData$?.pipe(
                map((season: Season) => {
                    let counter: number = 0;
                    for (const seasonAtt of season.media.seasons) {
                        counter += seasonAtt.episodeCount;
                    }
                    return counter;
                }),
            );

        if (!this.seasonData$) {
            this.hasError = true;
            return;
        }

        this.seasonDataSubscription = this.seasonData$.subscribe({
            next: (res: Season) => {
                this.titleService.setTitle(
                    `${res.media.name} - Glotzenheft`,
                );

                this.trackListForm = this.formBuilder.group({
                    trackListName: [res.media.name, Validators.required],
                });

                this.currentTracklist = res.tracklists[0];

                // join seasondata with tracklists
                this.tvDataWithTracklist =
                    this.joinTVWithTracklistsUseCase.execute(res);

                this.tracklistSelectionForm = this.formBuilder.group({
                    selectedTracklist: [null],
                });
                this.tracklistsOfSeason = res.tracklists;

                this.isLoading = false;
            },
            error: (err) => {
                if (err.status === 401) {
                    this.logoutOfAccountUseCase.execute();
                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    this.navigateToSpecificPageUseCase.execute(
                        ROUTES_LIST[10].fullUrl,
                    );
                } else if (err.status === 0) {
                    this.serverNotAvailablePage = true;
                }

                this.hasError = true;
                this.isLoading = false;
            },
        });
    };

    public getTracklistNumberOfSeason = (tracklistNumber: number): number => {
        return tracklistNumber + 1;
    };

    public getDefaultTracklist = (
        tracklistName: string
    ): Tracklist => {
        let airDateToUse = null;
        let startEp = null;
        let customSeason = null;

        const season = this.currentSeason;
        if (season)
        {
            customSeason = season.seasonNumber;
            startEp = 1;

            if (season.airDate)
            {
                airDateToUse = season.airDate;
            }
            else if (season.episodes
                && season.episodes.length > 0
                && season.episodes[0].airDate
            )
            {
                airDateToUse = season.episodes[0].airDate;
            }
        }

        return {
            createdAt: '',
            updatedAt: null,
            id: 0,
            rating: null,
            status: 'watching',
            startDate: new Date().toISOString(),
            finishDate: null,
            tracklistName: tracklistName,
            comment: null,
            customAirDate: airDateToUse,
            language: null,
            subtitle: null,
            customPosterPath: null,
            media: {
                id: 0,
                type: '',
                posterPath: '',
            },
            tracklistSeason: season ? {
                id: 0,
                startEpisodeNumber: startEp,
                endEpisodeNumber: null,
                customSeasonNumber: customSeason,
                customPartNumber: null,
                season: season as any,
                tracklistEpisodes: []
            } : null,
            isRewatching: false,
            tags: []
        };
    };

    public openTracklistForm = (season: TVSeasonWithTracklist) => {
        this.currentSeason = season;
        this.isTracklistFormVisible = 1;
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
            let currentTracklistInLocalStorage: SeasonTracklist | null = null;

            const currentTracklistInLocalStorageID: number | null =
                this.getSelectedTracklistsInLocalStorageUseCase.execute()
                    ? Number(
                          this.getSelectedTracklistsInLocalStorageUseCase.execute(),
                      )
                    : null;

            if (
                // checking if current tracklist in local storage is in this season
                currentTracklistInLocalStorageID &&
                season.tracklistsForSeason
                    .map((tracklist: SeasonTracklist) => tracklist.id)
                    .includes(currentTracklistInLocalStorageID)
            ) {
                currentTracklistInLocalStorage =
                    season.tracklistsForSeason.filter(
                        (tracklist: SeasonTracklist) =>
                            tracklist.id === currentTracklistInLocalStorageID,
                    )[0];
            }

            const tracklistToSelect = season.tracklistsForSeason.length > 0
                ? (currentTracklistInLocalStorage ?? season.tracklistsForSeason[0])
                : null;

            this.tracklistSelectionForm.get('selectedTracklist')?.setValue(tracklistToSelect);
        }

        this.selectedSeason = season;
        this.currentSeason = season;

        const selectedValue = this.tracklistSelectionForm.get('selectedTracklist')?.value;
        this.isEditingButtonVisible = !!selectedValue;
    };

    public setVisibility = (page: number) => {
        this.isTracklistFormVisible = page;
    };

    public setCurrentEpisode = (
        episode: SeasonEpisode,
        isEpisodeForEditing: boolean,
    ) => {
        this.currentEpisode = episode;

        if (!isEpisodeForEditing) {
            this.setVisibility(3);
            return;
        }
        this.setVisibility(4);
    };

    public refreshPage = () => {
        this.currentSeason = null;
        this.setVisibility(0);
        this.loadData(this.tvSeriesId);
    };

    public setSelectedTrackilst = (tracklist: SeasonTracklistType) => {
        this.currentTracklistSelection = tracklist;
        this.setVisibility(3);
    };

    public onChangeTab = (newTab: string) => {
        this.currentTab = newTab;
    };

    public getRecommendations = (recs: I_APIRecommendationResponse) => {
        this.apiRecommendations = recs;
    };

    // functions for creating tracklist --------------------------
    public createNewTracklist = (
        event: I_TracklistFormOutput,
        mediaId: number,
        seasonId: number,
    ) => {
        this.triggerTracklistCREATESEASONSubjectUseCase.execute({
            tracklist_name: event.tracklistName,
            media_id: mediaId,
            season_id: seasonId,
            tracklist_start_date: event.startDate,
            tracklist_finish_date: event.finishDate,
            tracklist_status: event.status,
            tracklist_rating: event.rating,
            is_rewatching: event.isRewatching,
            media_type: 'tv',
            comment: event.comment,
            custom_air_date: event.customAirDate,
            language: event.language,
            subtitle: event.subtitle,
            custom_poster_path: event.customPosterPath,
            start_episode_number: event.startEpisodeNumber,
            end_episode_number: event.endEpisodeNumber,
            custom_season_number: event.customSeasonNumber,
            custom_part_number: event.customPartNumber,
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
            tracklist_rating: event.rating,
            tracklist_start_date: event.startDate,
            tracklist_finish_date: event.finishDate,
            is_rewatching: event.isRewatching,
            comment: event.comment,
            custom_air_date: event.customAirDate,
            language: event.language,
            subtitle: event.subtitle,
            custom_poster_path: event.customPosterPath,
            start_episode_number: event.startEpisodeNumber,
            end_episode_number: event.endEpisodeNumber,
            custom_season_number: event.customSeasonNumber,
            custom_part_number: event.customPartNumber,
        });
    };

    public deleteTracklist = (tracklistId: number) => {
        this.triggerTracklistDELETESubjectUseCase.execute(tracklistId);
    };

    public cancelTracklistForm = () => {
        this.setVisibility(0);
    };

    public handleImageError() {
        this.isThumbnailLoading = false;
        this.imageError = true;
    }

    public applyEpisodeFilter: boolean = true;

    // NEU: Prüft, ob die Trackliste überhaupt Grenzen (Start/Ende) definiert hat
    public hasCustomEpisodeBoundaries = (tracklist: SeasonTracklist | null): boolean => {
        if (!tracklist || !tracklist.tracklistSeason) return false;
        return tracklist.tracklistSeason.startEpisodeNumber !== null ||
            tracklist.tracklistSeason.endEpisodeNumber !== null;
    };

    // NEU: Filtert die Episoden basierend auf dem Schalter und den eingestellten Grenzen
    public getFilteredEpisodes = (
        episodes: SeasonEpisode[],
        tracklist: SeasonTracklist | null
    ): SeasonEpisode[] => {
        // Wenn der Schalter aus ist oder keine Trackliste/Season existiert -> alle anzeigen
        if (!this.applyEpisodeFilter || !tracklist || !tracklist.tracklistSeason) {
            return episodes;
        }

        const start = tracklist.tracklistSeason.startEpisodeNumber;
        const end = tracklist.tracklistSeason.endEpisodeNumber;

        if (start === null && end === null) {
            return episodes; // Keine Grenzen definiert -> alle anzeigen
        }

        return episodes.filter((epi: SeasonEpisode) => {
            let isValid = true;
            // Wenn eine Start-Episode definiert ist und die aktuelle davor liegt -> wegfiltern
            if (start !== null && epi.episodeNumber < start) {
                isValid = false;
            }
            // Wenn eine End-Episode definiert ist und die aktuelle danach liegt -> wegfiltern
            if (end !== null && epi.episodeNumber > end) {
                isValid = false;
            }
            return isValid;
        });
    };
}
