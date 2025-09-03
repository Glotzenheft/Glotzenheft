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

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { RatingModule } from 'primeng/rating';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DateFormattingPipe } from '../../../../pipes/date-formatting/date-formatting.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { I_TracklistFormOutput, Tracklist } from '../../../../app/shared/interfaces/tracklist-interfaces';
import {
    convertTracklistStatusIntoGerman,
    TRACK_LIST_STATUS_LIST_AS_OBJECT,
    TracklistStatusType,
} from '../../../../app/shared/variables/tracklist';
import { TMDB_POSTER_PATH } from '../../../../app/shared/variables/tmdb-vars';
import { ROUTES_LIST } from '../../../../app/shared/variables/routes-list';
import { UC_GetAllUserTracklists } from '../../../../app/core/use-cases/media/get-all-user-tracklists.use-case';
import { TracklistFormularComponent } from "../../../media/mediaDetailsCOMPONENTS/tracklist-formular/tracklist-formular.component";
import { UC_GetTracklistUPDATEResponseSubject } from '../../../../app/core/use-cases/media/get-tracklist-update-response-subject.use-case';
import { UC_GetTracklistDELETEResponseSubject } from '../../../../app/core/use-cases/media/get-tracklist-delete-response-subject.use-case';
import { UC_TriggerTracklistUPDATESubject } from '../../../../app/core/use-cases/media/trigger-tracklist-update.subject.use-case';
import { UC_TriggerTracklistDELETESubject } from '../../../../app/core/use-cases/media/trigger-tracklist-delete-subject.use-case';
import { MessageService } from 'primeng/api';
import { UC_NavigateToSpecificPage } from '../../../../app/core/use-cases/navigation/navigate-to-specific-page.use-case';
import { ERR_OBJECT_INVALID_AUTHENTICATION, getMessageObject } from '../../../../app/shared/variables/message-vars';
import { UC_LogoutOfAccount } from '../../../../app/core/use-cases/user/log-out-of-account.use-case';

@Component({
    selector: 'app-all-user-tracklists',
    imports: [
    CommonModule,
    CardModule,
    DateFormattingPipe,
    DialogModule,
    TableModule,
    AccordionModule,
    PanelModule,
    RatingModule,
    FormsModule,
    ButtonModule,
    ProgressSpinnerModule,
    SelectModule,
    ReactiveFormsModule,
    FloatLabelModule,
    TracklistFormularComponent
],
    templateUrl: './all-user-tracklists.component.html',
    styleUrl: './all-user-tracklists.component.css',
    providers: [
        UC_GetAllUserTracklists,
        UC_GetTracklistDELETEResponseSubject,
        UC_GetTracklistUPDATEResponseSubject,
        UC_TriggerTracklistDELETESubject,
        UC_TriggerTracklistUPDATESubject,
        UC_NavigateToSpecificPage,
        UC_LogoutOfAccount
    ],
})
export class AllUserTracklistsComponent implements OnInit {
    public allTracklists: Tracklist[] | null = null;
    public sortedUserTracklists: Tracklist[] | null = null;

    public currentFilterForm!: FormGroup;

    public tracklistStatusFilterList: { german: string; value: string }[] =
        TRACK_LIST_STATUS_LIST_AS_OBJECT;
    public currentFilterStatus: TracklistStatusType = 'watching';

    public tracklistMediaTypeFilterList: { german: string; value: string }[] = [
        {
            german: 'Alle Medien',
            value: 'all',
        },
        {
            german: 'Filme',
            value: 'movie',
        },
        {
            german: 'Serien',
            value: 'tv',
        },
    ];
    public currentFilterMediaType: 'all' | 'movie' | 'tv' = 'all';

    public posterPath: string = TMDB_POSTER_PATH;
    public isDialogVisible: boolean = false;
    public currentTracklist: Tracklist | null = null;
    public tracklistStatusClass: string | null = null;
    public tmdbPosterPath: string = TMDB_POSTER_PATH;
    public visibility: number = 0;

    public isLoading: boolean = false;
    public serverNotAvailablePage: boolean = false;

    public convertStatus = convertTracklistStatusIntoGerman;

    constructor(
        private formBuilder: FormBuilder,
        private getAllUserTracklistsUseCase: UC_GetAllUserTracklists,
        private readonly getTracklistUPDATEResponseSubjectUseCase: UC_GetTracklistUPDATEResponseSubject,
        private readonly getTracklistDELETEResponseSubjectUseCase: UC_GetTracklistDELETEResponseSubject,
        private readonly triggerTracklistUPDATESubjectUseCase: UC_TriggerTracklistUPDATESubject,
        private readonly triggerTracklistDELETESubjectUseCase: UC_TriggerTracklistDELETESubject,
        private readonly messageService: MessageService,
        private readonly navigateToSpecificPageUseCase: UC_NavigateToSpecificPage,
        private readonly logoutOfAccountUseCase: UC_LogoutOfAccount
    ) {}

    ngOnInit(): void {
        this.currentFilterForm = this.formBuilder.group({
            statusFilter: this.tracklistStatusFilterList[0],
            mediaFilter: this.tracklistMediaTypeFilterList[0],
        });

        this.getTracklistUPDATEResponseSubjectUseCase.execute().subscribe({
            next: () => {
                this.messageService.add(getMessageObject("success", "Tracklist erfolgreich aktualisiert"));
                this.refreshPage(false);
            
            },
            error: (err) => {
                if (err.status === 401) {
                                    // status 401 = user is not logged in anymore -> navigate to login page
                                    this.logoutOfAccountUseCase.execute();
                                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                                    void this.navigateToSpecificPageUseCase.execute(ROUTES_LIST[10].fullUrl);
                                    return;
                                }
                
                                this.messageService.add(getMessageObject("error", "Fehler beim Aktualisieren der Tracklist"));
            }
        });

        this.getTracklistDELETEResponseSubjectUseCase.execute().subscribe({
            next: () => {
                this.messageService.add(getMessageObject("success", "Tracklist erfolgreich gelöscht"));
                this.refreshPage(false);
            },
            error: (err) => {
                if (err.status === 401) {
                    // status 401 = user is not logged in anymore -> navigate to login page
                    this.logoutOfAccountUseCase.execute();
                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    void this.navigateToSpecificPageUseCase.execute(ROUTES_LIST[10].fullUrl);
                    return;
                }

                this.messageService.add(getMessageObject("error", "Fehler beim Löschen der Tracklist"));
            }
        })

        this.loadTracklists();
    }

    public loadTracklists = () => {
        this.serverNotAvailablePage = false;
        this.isLoading = true;


        this.getAllUserTracklistsUseCase.execute().subscribe({
            next: (res: Tracklist[] | null) => {
                if (!res) {
                    return;
                }

                this.isLoading = false;
                this.sortedUserTracklists = res
                    .filter((tracklist: Tracklist) => {
                        return (
                            tracklist.status ===
                            this.currentFilterForm.get('statusFilter')?.value
                                .value
                        );
                    })
                    .filter((tracklist: Tracklist) => {
                        if (
                            this.currentFilterForm.get('mediaFilter')?.value
                                .value === 'all'
                        ) {
                            return true;
                        } else {
                            return (
                                tracklist.media.type ===
                                this.currentFilterForm.get('mediaFilter')?.value
                                    .value
                            );
                        }
                    });

                this.allTracklists = res;
            },
            error: (err) => {
                if (err.status === 401) {
                    this.navigateToSpecificPageUseCase.execute(`/${ROUTES_LIST[1].fullUrl}`);
                } else if (err.status === 0) {
                    this.serverNotAvailablePage = true;
                }

                this.isLoading = false;
            },
        });
    };

    public navigateToDetailspage = (mediaID: number, mediaType: string) => {
        let url: string =
            mediaType.trim() === 'movie'
                ? `${ROUTES_LIST[5].fullUrl}/${mediaID}`
                : `${ROUTES_LIST[6].fullUrl}/${mediaID}`;

        this.navigateToSpecificPageUseCase.execute(url);
    };

    /**
     * Function for settting the CSS class for the current status of the tracklist.
     * @param status string
     * @returns string
     */
    public setTracklistStatus = (status: string): string => {
        switch (status) {
            case 'watching':
                this.tracklistStatusClass = 'statusWatching';
                return 'statusWatching';

            case 'pausing':
                this.tracklistStatusClass = 'statusPausing';
                return 'statusPausing';

            case 'dropped':
                this.tracklistStatusClass = 'statusDropped';
                return 'statusDropped';

            case 'plan to watch':
                this.tracklistStatusClass = 'statusPlanToWatch';
                return 'statusPlanToWatch';

            case 'completed':
                this.tracklistStatusClass = 'statusCompleted';
                return 'statusCompleted';
        }
        return '';
    };

    /**
     * Function for switching them visible component to the editing tracklist interface.
     * @param tracklist Tracklist
     * @param isMovie boolean
     * @returns void
     */
    public editTracklist = (tracklist: Tracklist, isMovie: boolean) => {
        this.currentTracklist = tracklist;
        this.visibility = isMovie ? 1 : 2;
    };

    /**
     * Function returning the page to the tracklist list page.
     * @param isCancelling boolean
     * @return void
     */
    public refreshPage = (isCancelling: boolean) => {
        // refreshing page
        this.visibility = 0;

        if (!isCancelling) {
            // refresh page if user has updated tracklist
            this.loadTracklists();
        }
    };

    public setSortedTracklistList = () => {
        // sorting the list with the current values of the selections
        if (!this.allTracklists) {
            return;
        }

        this.sortedUserTracklists = this.allTracklists
            .filter((tracklist: Tracklist) => {
                return (
                    tracklist.status ===
                    this.currentFilterForm.get('statusFilter')?.value.value
                );
            })
            .filter((tracklist: Tracklist) => {
                if (
                    this.currentFilterForm.get('mediaFilter')?.value.value ===
                    'all'
                ) {
                    return true;
                }

                return (
                    tracklist.media.type ===
                    this.currentFilterForm.get('mediaFilter')?.value.value
                );
            });
    };

    public cancelTracklist = () => {
        this.visibility = 0;
    }

    public updateTracklist = (event: I_TracklistFormOutput) => {
        this.triggerTracklistUPDATESubjectUseCase.execute({
            tracklist_id: event.id,
            tracklist_status: event.status,
            tracklist_start_date: event.startDate,
            tracklist_finish_date: event.finishDate,
            is_rewatching: event.isRewatching,
            tracklist_name: event.tracklistName,
            tracklist_rating: event.rating
        });
    }

    public deleteTracklist = (event: number) => {this.triggerTracklistDELETESubjectUseCase.execute(event);}
}
