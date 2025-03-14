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
import {
  MediaIDResponse,
  MediaResult,
  MultiSearchResponse,
} from '../../../../shared/interfaces/media-interfaces';
import { MediaService } from '../../../../service/media/media.service';
import { SearchService } from '../../../../service/search/search.service';
import { UserService } from '../../../../service/user/user.service';
import { ROUTES_LIST } from '../../../../shared/variables/routes-list';
import { getMessageObject } from '../../../../shared/variables/message-vars';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';

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
  //   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSearchComponent implements OnInit, OnDestroy {
  public searchQuery: string = ''; // Suchtext aus der Eingabe
  public results$: Observable<MultiSearchResponse> | null = null;

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
  public userSearchQuery: string = '';
  private searchSubscription!: Subscription;
  public isErrorDialogVisible: boolean = false;
  public isLoading: boolean = false;
  public MAX_STRING_LENGTH: number = 25;
  public currentSearchTerm: string = '';

  // variables for pagination
  public currentPage: number = 1; // >= 1
  public nextPagesLimit: number | null = null; // the limit for the next page button => for disabling the button
  public isNextPageButtonDisabled: boolean = true;
  public isPrevPageButtonDisabled: boolean = true;

  constructor(
    private mediaService: MediaService,
    private searchService: SearchService,
    private router: Router,
    private messageService: MessageService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.tracklistFilterForm = this.formBuilder.group({
      tracklistMediaTypeSelection: this.tracklistMediaSelectionList[0],
    });

    this.searchSubscription = this.searchService.searchTerm$.subscribe({
      next: (searchTerm) => {
        if (!searchTerm.trim()) {
          this.showErrorDialog();
          return;
        }

        this.currentSearchTerm = searchTerm;

        if (searchTerm.trim() === this.searchQuery.trim()) {
          // return if old search query is equal to the new search query, e. g. user hits button multiple times while query term remains the same
          return;
        }

        // resetting page limit and current page
        this.nextPagesLimit = null;
        this.currentPage = 1;

        this.isLoading = true;
        this.loadMultiSearchResults(1, this.currentSearchTerm);
      },
      error: (err) => {
        if (err.status === 401) {
          // 401 = user token not valid anymore -> navigate to login page
          this.userService.showLoginMessage();

          this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
        }
      },
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  public loadMultiSearchResults = (page: number, searchTerm: string) => {
    this.hasError = false;
    this.results$ = this.mediaService.getMultiSearchResults(
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

        this.setFilteredResults();

        // pages limit is delivered in every response
        this.nextPagesLimit = res.total_pages + 1;

        // logic for pagination ----------------------------------------------------------------
        this.currentPage = page;

        if (this.currentPage < 2) {
          // disable prev button
          this.isPrevPageButtonDisabled = true;
        }

        if (this.nextPagesLimit) {
          if (this.currentPage < this.nextPagesLimit - 1) {
            this.isNextPageButtonDisabled = false;
          } else if (this.currentPage < this.nextPagesLimit) {
            this.isNextPageButtonDisabled = true;
          }
        } else {
          if (res.results.length < 1 && this.currentPage > 1) {
            // return to previous page if loaded page has no entries
            this.isNextPageButtonDisabled = true;
            this.currentPage--;
            this.loadMultiSearchResults(
              this.currentPage,
              this.currentSearchTerm
            );
            return;
          } else if (res.results.length < 1 && this.currentPage < 2) {
            this.isNextPageButtonDisabled = true;
            this.isPrevPageButtonDisabled = true;
          } else if (this.currentPage === 1) {
            this.isNextPageButtonDisabled = false;
            this.isPrevPageButtonDisabled = true;
          } else {
            this.isNextPageButtonDisabled = res.results.length <= 0;
            this.isPrevPageButtonDisabled = this.currentPage === 1;
          }
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

  closeErrorDialog = () => {
    this.isErrorDialogVisible = false;
  };

  navigateToMediaPage = (id: number, mediaGenre: string) => {
    this.mediaService.getMediaIdForMedia(id, mediaGenre === 'movie').subscribe({
      next: (res: MediaIDResponse) => {
        let url: string = '';

        if (res.media_id === undefined || res.media_id === null) {
          // if no media_id exists in the db -> because media is not already saved
          const summaryMessage: string = `Fehler beim Weiterleiten ${
            mediaGenre === 'movie' ? 'zum Film.' : 'zur Serie'
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
        url =
          mediaGenre === 'movie'
            ? ROUTES_LIST[5].fullUrl + `/${res.media_id}`
            : ROUTES_LIST[6].fullUrl + `/${res.media_id}`;

        this.router.navigateByUrl(url);
      },
      error: (err) => {
        if (err.status === 401) {
          // 401 = user token is not logged in anymore -> navigate to login page
          this.userService.showLoginMessage();
          this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
          return;
        }

        const message: string = `Fehler beim Weiterleiten ${
          mediaGenre === 'movie' ? 'zum Film.' : 'zur Serie.'
        }`;

        this.messageService.add(
          getMessageObject(
            'error',
            message,
            'Bitte lade die Seite und versuche es erneut.'
          )
        );
      },
    });
  };

  public changeToNextPage = () => {
    if (this.isNextPageButtonDisabled) {
      return;
    }

    this.currentPage++;
    this.isNextPageButtonDisabled = false;
    this.isPrevPageButtonDisabled = false;
    this.loadMultiSearchResults(this.currentPage, this.currentSearchTerm);
  };

  public changeToPrePage = () => {
    if (this.isPrevPageButtonDisabled) {
      return;
    }

    this.currentPage--;
    this.loadMultiSearchResults(this.currentPage, this.currentSearchTerm);
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
}
