import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MediaService } from '../../../service/media/media.service';
import { Observable, Subscription } from 'rxjs';
import {
  MediaIDResponse,
  MediaResult,
  MultiSearchResponse,
} from '../../../shared/interfaces/media-interfaces';
import { SearchService } from '../../../service/search/search.service';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';
import { MessageService } from 'primeng/api';
import { MEDIA_ID_NOT_EXISTS } from '../../../shared/variables/navigation-vars';
import { UserService } from '../../../service/user/user.service';

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
  ],
  styleUrls: ['./multi-search.component.css'],
  //   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSearchComponent implements OnInit, OnDestroy {
  public searchQuery: string = ''; // Suchtext aus der Eingabe
  public results: any = null; // JSON-Ergebnisse
  public results$: Observable<MultiSearchResponse> | null = null;
  public item: MediaResult[] = [];
  public error: string | null = null; // Fehleranzeige
  public userSearchQuery: string = '';
  private searchSubscription!: Subscription;
  public isErrorDialogVisible: boolean = false;
  public isLoading: boolean = false;
  public MAX_STRING_LENGTH: number = 25;

  constructor(
    private mediaService: MediaService,
    private searchService: SearchService,
    private router: Router,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchService.searchTerm$.subscribe({
      next: (searchTerm) => {
        if (!searchTerm.trim()) {
          this.showErrorDialog();
          return;
        }

        if (searchTerm.trim() === this.searchQuery.trim()) {
          // return if old search query is equal to the new search query, e. g. user hits button multiple times while query term remains the same
          return;
        }

        this.isLoading = true;
        this.results$ = this.mediaService.getMultiSearchResults(searchTerm);

        this.results$.subscribe((ress) => {
          this.item = ress.results.filter(
            (r) => r.media_type === 'tv' || r.media_type === 'movie'
          );
        });
        this.searchQuery = searchTerm;
        this.isLoading = false;
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

  showErrorDialog = () => {
    this.messageService.add({
      severity: 'warn',
      life: 7000,
      summary: 'Das Suchfeld darf nicht leer sein',
      detail:
        'Das Suchfeld muss mindestens ein Zeichen enthalten, um eine Suche durchführen zu können.',
    });
  };

  closeErrorDialog = () => {
    this.isErrorDialogVisible = false;
  };

  navigateToMediaPage = (id: number, mediaGenre: string) => {
    this.mediaService
      .getMediaIdForMedia(id, mediaGenre === 'movie' ? true : false)
      .subscribe({
        next: (res: MediaIDResponse) => {
          let url: string = '';

          if (res.media_id === undefined || res.media_id === null) {
            // if no media_id exists in the db -> because media is not already saved
            const summaryMessage: string = `Fehler beim Weiterleiten ${
              mediaGenre === 'movie' ? 'zum Film.' : 'zur Serie'
            }`;

            this.messageService.add({
              life: 7000,
              severity: 'error',
              summary: summaryMessage,
              detail:
                'Es ist ein Fehler beim Weiterleiten zum Medium passiert. Bitte lade die Seite erneut und versuche es noch einmal.',
            });
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

          this.messageService.add({
            life: 7000,
            severity: 'error',
            summary: message,
            detail:
              'Beim Weiterleiten ist ein Fehler aufgetreten. Bitte lade die Seite und versuche es erneut.',
          });
        },
      });
  };
}
