import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MediaService } from '../../../service/media/media.service';
import { Observable, Subscription } from 'rxjs';
import {
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchService.searchTerm$.subscribe(
      (searchTerm) => {
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
      }
    );
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  showErrorDialog = () => {
    this.isErrorDialogVisible = true;
  };

  closeErrorDialog = () => {
    this.isErrorDialogVisible = false;
  };

  navigateToMediaPage = (id: number, isMovie: boolean) => {
    if (isMovie) {
      this.router.navigateByUrl(ROUTES_LIST[6].fullUrl + `/${id}`);
      return;
    }

    this.router.navigateByUrl(ROUTES_LIST[7].fullUrl + `/${id}`);
  };
}
