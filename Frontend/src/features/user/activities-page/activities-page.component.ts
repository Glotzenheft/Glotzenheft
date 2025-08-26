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
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { DateFormattingPipe } from '../../../pipes/date-formatting/date-formatting.pipe';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TMDB_POSTER_PATH } from '../../../app/shared/variables/tmdb-vars';
import { Router } from '@angular/router';
import { ERR_OBJECT_INVALID_AUTHENTICATION, getMessageObject } from '../../../app/shared/variables/message-vars';
import { ROUTES_LIST } from '../../../app/shared/variables/routes-list';
import { UC_GetUserActivites } from '../../../app/core/use-cases/user/get-user-activities.use-case';
import { UC_LogoutOfAccount } from '../../../app/core/use-cases/user/log-out-of-account.use-case';
import { SelectOption } from "../../../app/shared/interfaces/select-option.interface";
import { UserActivitiesResponse, UserActivity, UserActivityWithDaySplitt } from '../../../app/shared/interfaces/user-interfaces';

@Component({
    selector: 'app-activities-page',
    imports: [
        TableModule,
        ButtonModule,
        DateFormattingPipe,
        CommonModule,
        ButtonModule,
        TooltipModule,
        ProgressSpinnerModule,
        DropdownModule,
        FormsModule,
        PaginationComponent
    ],
    templateUrl: './activities-page.component.html',
    styleUrl: './activities-page.component.css',
    providers: [UC_GetUserActivites, UC_LogoutOfAccount, UC_NavigateToPage]
})
export class ActivitiesPageComponent implements OnInit {
    // variables for user activities overview
    public userActivitiesRequest$: Observable<UserActivitiesResponse> | null = null;
    public userActivitiesListWithDaySplitter: UserActivityWithDaySplitt[] = [];

    public currentPage: number = 1;
    public totalPages: number = 1;
    public totalResults: number = 0;
    public pageOptions: SelectOption[] = [];
    public isLeftButtonDisabled: boolean = true;
    public isRightButtonDisabled: boolean = false;
    public isTableLoading: boolean = false;
    public isError: boolean = false;
    public serverNotAvailablePage: boolean = false;

    public posterPath: string = TMDB_POSTER_PATH;

    public isLoading: boolean = false;

    constructor(
        private messageService: MessageService,
        private getActivitiesUseCase: UC_GetUserActivites,
        private logoutOfAccountUseCase: UC_LogoutOfAccount,
        private readonly navigateToPageUseCase: UC_NavigateToPage
    ) { }

    ngOnInit(): void {
        this.loadUserActivities(1);
    }

    // functions --------------------------------------------------
    public loadUserActivities = (page: number) => {
        this.serverNotAvailablePage = false;
        this.isLoading = true;
        this.isTableLoading = true;
        this.userActivitiesRequest$ = this.getActivitiesUseCase.execute(page);

        if (!this.userActivitiesRequest$) {
            this.isError = true;
            return;
        }

        this.userActivitiesRequest$.subscribe({
            next: (response) => {
                const userActivities = response.results;
                this.currentPage = response.page;
                this.isLeftButtonDisabled = this.currentPage === 1;
                this.isRightButtonDisabled = this.currentPage === this.totalPages;
                this.totalPages = response.total_pages;
                this.totalResults = response.total_results;

                this.pageOptions = this.totalPages > 0
                    ? Array.from({ length: this.totalPages }, (_, i) => ({
                        label: (i + 1).toString(),
                        value: i + 1,
                    }))
                    : [{ label: '0', value: 0 }];

                const sortedUserActivities: UserActivity[] = userActivities.sort(
                    (a: UserActivity, b: UserActivity) => {
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    }
                );

                this.userActivitiesListWithDaySplitter = [];

                const weekDays = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];
                const dailyStats = new Map<
                    string,
                    { totalRuntime: number; mediaCount: number }
                >();

                sortedUserActivities.forEach((userActivity) => {
                    const dateKey = userActivity.date.split(' ')[0];

                    if (!dailyStats.has(dateKey)) {
                        dailyStats.set(dateKey, { totalRuntime: 0, mediaCount: 0 });
                    }

                    const stats = dailyStats.get(dateKey)!;
                    stats.totalRuntime += userActivity.runtime || 0;
                    stats.mediaCount += 1;
                });

                let lastDateKey = '';

                sortedUserActivities.forEach((userActivity) => {
                    const dateAsDate = new Date(userActivity.date);
                    const formattedDate = dateAsDate.toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    });
                    const weekDay = weekDays[dateAsDate.getDay()];
                    const dateKey = userActivity.date.split(' ')[0];

                    if (dateKey !== lastDateKey) {
                        const stats = dailyStats.get(dateKey)!;

                        this.userActivitiesListWithDaySplitter.push({
                            date: `${weekDay} ${formattedDate} `,
                            episodeID: stats.mediaCount,
                            episodeNumber: null,
                            mediaID: 0,
                            mediaTitle: '',
                            posterPath: null,
                            runtime: stats.totalRuntime,
                            seasonID: null,
                            seasonNumber: null,
                            stillPath: null,
                            tracklistEpisodeID: null,
                            tracklistID: -1,
                            tracklistName: '',
                            tracklistSeasinID: null,
                            type: '',
                            isDateSplitter: true,
                            picture: null
                        });

                        lastDateKey = dateKey;
                    }

                    // Füge die eigentliche Aktivität hinzu
                    this.userActivitiesListWithDaySplitter.push({
                        ...userActivity,
                        isDateSplitter: false,
                        picture: userActivity.stillPath !== null
                            ? userActivity.stillPath
                            : userActivity.posterPath
                    });
                });

                // logic for pagination -------------------------------------------------
                if (this.totalPages === 0) {
                    this.currentPage = 0;
                    this.isLeftButtonDisabled = true;
                    this.isRightButtonDisabled = true;
                }
                else if (this.currentPage === 1) {
                    this.isRightButtonDisabled = this.currentPage == this.totalPages;
                    this.isLeftButtonDisabled = true;
                }
                else if (this.currentPage > 1) {
                    this.isRightButtonDisabled = this.currentPage >= this.totalPages;
                    this.isLeftButtonDisabled = false;
                }
                this.isLoading = false;
            },
            error: (err: any) => {
                if (err.status === 401) {
                    this.logoutOfAccountUseCase.execute();
                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    void this.navigateToPageUseCase.execute(ROUTES_LIST[10].fullUrl);

                    return;
                } else if (err.status === 0) {
                    this.serverNotAvailablePage = true;
                }

                this.isError = true;
                this.messageService.add(
                    getMessageObject(
                        'error',
                        'Fehler beim Laden der Daten',
                        'Bitte probiere es erneut.'
                    )
                );

                this.isLoading = false;
            },
        });

        this.isTableLoading = false;
    };

    public changeToNextPage = () => {
        if (this.currentPage == this.totalPages) {
            this.isRightButtonDisabled = true;
            return;
        }
        this.currentPage++;
        this.currentPage++;
        this.isRightButtonDisabled = false;
        this.isLeftButtonDisabled = false;
        this.loadUserActivities(this.currentPage);
    };

    public changeToPreviousPage = () => {
        if (this.currentPage < 2) {
            this.isLeftButtonDisabled = true;
            return;
        }

        this.currentPage--;
        this.currentPage--;
        this.loadUserActivities(this.currentPage);
    };

    public onClickActivity = (activity: UserActivityWithDaySplitt) => {
        if (activity.type === 'movie') {
            void this.navigateToPageUseCase.execute(`${ROUTES_LIST[5].fullUrl}/${activity.mediaID}`);
        } else {
            void this.navigateToPageUseCase.execute(`${ROUTES_LIST[6].fullUrl}/${activity.mediaID}`);
        }
    };

    public onPageSelect = (page: number) => {
        this.loadUserActivities(page);
    };
}
