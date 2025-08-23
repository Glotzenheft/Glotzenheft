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
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MediaIDResponse, MediaResult, MultiSearchResponse } from '../../../../app/shared/interfaces/media-interfaces';
import { ROUTES_LIST } from '../../../../app/shared/variables/routes-list';
import { getMessageObject } from '../../../../app/shared/variables/message-vars';
import { UC_GetMultiSearchResults } from '../../../../app/core/use-cases/media/get-multisearch-results.use-case';
import { UC_GetMediaIdForMedia } from '../../../../app/core/use-cases/media/get-media-id-for-media.use-case';
import { UC_GetSearchTerm } from '../../../../app/core/use-cases/search/get-search-term.use-case';
import { UC_ShowLoginMessage } from '../../../../app/core/use-cases/user/show-login-message.use-case';
import { TMDB_IMG_ROUTE } from '../../../../app/shared/variables/image-route';
import { SelectOption } from "../../../../app/shared/interfaces/select-option.interface";

@Component({
    selector: 'app-multi-search',
    templateUrl: './multi-search.component.html',
    imports: [
        FormsModule,
        CommonModule,
        AsyncPipe,
        DialogModule,
        ProgressSpinnerModule,
        CardModule,
        TooltipModule,
        ButtonModule,
        SelectModule,
        FloatLabelModule,
        ReactiveFormsModule,
    ],
    styleUrls: ['./multi-search.component.css'],
    providers: [UC_GetMediaIdForMedia, UC_GetMultiSearchResults, UC_GetSearchTerm, UC_ShowLoginMessage]
    //   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSearchComponent implements OnInit, OnDestroy {
    public searchQuery: string = ''; // Suchtext aus der Eingabe
    public results$: Observable<MultiSearchResponse> | null = null;
    public IMG_ROUTE: string = TMDB_IMG_ROUTE

    // variables for sorting the results
    public resultsForCurrentPage: MediaResult[] | null = null;
    public sortedResults: MediaResult[] | null = null;
    public tracklistMediaSelectionList: { german: string; value: string }[] = [
        {
            german: 'Alle Medien',
            value: 'all',
        },
        {
            german: 'Serien',
            value: 'tv',
        },
        {
            german: 'Filme',
            value: 'movie',
        },
    ];
    public tracklistFilterForm!: FormGroup;

    public item: MediaResult[] = [];
    public hasError: boolean = false;
    private searchSubscription!: Subscription;
    public isLoading: boolean = false;
    public MAX_STRING_LENGTH: number = 25;
    public currentSearchTerm: string = '';

    // variables for pagination
    public currentPage: number = 1; // >= 1
    public totalPages: number = 1;
    public totalResults: number = 0;
    public pageOptions: SelectOption[] = [];
    public visibleCountOnPage: number = 0;
    public nextPagesLimit: number | null = null; // the limit for the next page button => for disabling the button
    public isNextPageButtonDisabled: boolean = true;
    public isPrevPageButtonDisabled: boolean = true;

    constructor(
        private router: Router,
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private getMultiSearchResultUseCase: UC_GetMultiSearchResults,
        private getMediaIdForMediaUseCase: UC_GetMediaIdForMedia,
        private getSearchTermUseCase: UC_GetSearchTerm,
        private showLoginMessageUseCase: UC_ShowLoginMessage
    ) { }

    ngOnInit(): void {
        this.tracklistFilterForm = this.formBuilder.group({
            tracklistMediaTypeSelection: this.tracklistMediaSelectionList[0],
        });

        this.searchSubscription = this.getSearchTermUseCase.observe().subscribe({
            next: (searchTerm) => {
                if (!searchTerm.trim()) {
                    this.pageOptions = [{ label: '0', value: 0 }];
                    this.totalPages = 0;
                    this.showErrorDialog();
                    return;
                }

                this.currentSearchTerm = searchTerm;

                if (searchTerm.trim() === this.searchQuery.trim()) {
                    // return if old search query is equal to the new search query, e.g. user hits button multiple times while query term remains the same
                    return;
                }

                // resetting page limit and current page
                this.nextPagesLimit = null;
                this.currentPage = 1;

                this.isLoading = true;
                this.loadMultiSearchResults(this.currentSearchTerm);
            },
            error: (err) => {
                if (err.status === 401) {
                    // 401 = user token not valid anymore -> navigate to login page
                    this.showLoginMessageUseCase.execute();

                    void this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                }
            },
        });
    }

    ngOnDestroy(): void {
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
    }

    public loadMultiSearchResults = (searchTerm: string) => {
        this.hasError = false;
        this.results$ = this.getMultiSearchResultUseCase.execute(
            searchTerm,
            this.currentPage
        );

        this.results$.subscribe({
            next: (res) => {
                this.item = res.results.filter(
                    (r) => r.media_type === 'tv' || r.media_type === 'movie'
                );

                this.resultsForCurrentPage = res.results.filter(
                    (r) => r.media_type === 'tv' || r.media_type === 'movie'
                );

                this.visibleCountOnPage = this.resultsForCurrentPage.length;

                this.setFilteredResults();

                this.totalResults = res.total_results;
                this.totalPages = res.total_pages;

                this.pageOptions = this.totalPages > 0
                    ? Array.from({ length: this.totalPages }, (_, i) => ({
                        label: (i + 1).toString(),
                        value: i + 1,
                    }))
                    : [{ label: '0', value: 0 }];

                // pages limit is delivered in every response
                this.nextPagesLimit = res.total_pages + 1;

                // logic for pagination ----------------------------------------------------------------
                this.currentPage = res.page;

                if (this.totalPages === 0) {
                    this.currentPage = 0;
                    this.isPrevPageButtonDisabled = true;
                    this.isNextPageButtonDisabled = true;
                }
                else if (this.currentPage === 1) {
                    this.isNextPageButtonDisabled = this.currentPage == this.totalPages;
                    this.isPrevPageButtonDisabled = true;
                }
                else if (this.currentPage > 1) {
                    this.isNextPageButtonDisabled = this.currentPage >= this.totalPages;
                    this.isPrevPageButtonDisabled = false;
                }
                this.isLoading = false;
            },
            error: (err: any) => {
                this.isLoading = false;

                if (err.status === 0) {
                    this.hasError = true;
                }
            },
        });
        this.searchQuery = searchTerm;
        this.isLoading = false;
    };

    showErrorDialog = () => {
        this.messageService.add(
            getMessageObject(
                'warn',
                'Das Suchfeld darf nicht leer sein.',
                'Das Suchfeld muss mindestens ein Zeichen enthalten.'
            )
        );
    };
    navigateToMediaPage = (id: number, mediaGenre: string) => {
        this.getMediaIdForMediaUseCase.execute(id, mediaGenre === 'movie').subscribe({
            next: (res: MediaIDResponse) => {
                let url: string = '';

                if (res.media_id === undefined || res.media_id === null) {
                    // if no media_id exists in the db -> because media is not already saved
                    const summaryMessage: string = `Fehler beim Weiterleiten ${mediaGenre === 'movie'
                            ? 'zum Film.'
                            : 'zur Serie.'
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

                // media_id already exists
                url = mediaGenre === 'movie'
                    ? ROUTES_LIST[5].fullUrl + `/${res.media_id}`
                    : ROUTES_LIST[6].fullUrl + `/${res.media_id}`;

                void this.router.navigateByUrl(url);
            },
            error: (err) => {
                if (err.status === 401) {
                    // 401 = user token is not logged in anymore -> navigate to login page
                    this.showLoginMessageUseCase.execute();
                    void this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                    return;
                }

                const message: string = `Fehler beim Weiterleiten ${mediaGenre === 'movie'
                        ? 'zum Film.'
                        : 'zur Serie.'
                    }`;

                this.messageService.add(
                    getMessageObject(
                        'error',
                        message,
                        'Bitte lade die Seite erneut und versuche es noch einmal.'
                    )
                );
            },
        });
    };

    public changeToNextPage = () => {
        if (this.currentPage == this.totalPages) {
            this.isNextPageButtonDisabled = true;
            return;
        }

        this.currentPage++;
        this.isNextPageButtonDisabled = false;
        this.isPrevPageButtonDisabled = false;
        this.loadMultiSearchResults(this.currentSearchTerm);
    };

    public changeToPrevPage = () => {
        if (this.currentPage < 2) {
            this.isPrevPageButtonDisabled = true;
            return;
        }

        this.currentPage--;
        this.loadMultiSearchResults(this.currentSearchTerm);
    };

    public setFilteredResults = () => {
        if (!this.resultsForCurrentPage) {
            return;
        }

        this.sortedResults = this.resultsForCurrentPage.filter(
            (result: MediaResult) => {
                if (
                    this.tracklistFilterForm.get('tracklistMediaTypeSelection')?.value
                        .value === 'all'
                ) {
                    return true;
                } else {
                    return (
                        this.tracklistFilterForm
                            .get('tracklistMediaTypeSelection')
                            ?.value.value.trim() === result.media_type.trim()
                    );
                }
            }
        );
    };

    public onPageSelect = (page: number) => {
        this.currentPage = page;
        this.loadMultiSearchResults(this.searchQuery);
    };
}
