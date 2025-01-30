import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule, JsonPipe, NgIf } from '@angular/common';
import { ROUTE_MULTI_SEARCH } from '../../../shared/variables/api-routes';
import { MediaService } from '../../../service/media/media.service';
import { Observable } from 'rxjs';
import { Card } from 'primeng/card';
import { ActivatedRoute } from '@angular/router';
import {
  MediaResult,
  MultiSearchResponse,
} from '../../../shared/interfaces/media-interfaces';

@Component({
  selector: 'app-multi-search',
  templateUrl: './multi-search.component.html',
  imports: [FormsModule, CommonModule, AsyncPipe],
  styleUrls: ['./multi-search.component.css'],
  //   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSearchComponent implements OnInit {
  searchQuery: string = ''; // Suchtext aus der Eingabe
  results: any = null; // JSON-Ergebnisse
  results$: Observable<MultiSearchResponse> | null = null;
  item: MediaResult[] = [];
  error: string | null = null; // Fehleranzeige
  userSearchQuery: string = '';

  constructor(
    private http: HttpClient,
    private mediaService: MediaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['query'] ?? '';
      console.log('neue Anfrage: ', this.searchQuery);
      this.results$ = this.mediaService.getMultiSearchResults(this.searchQuery);
      this.results$.subscribe((ress) => {
        this.item = ress.results.filter(
          (r) => r.media_type === 'tv' || r.media_type === 'movie'
        );
      });
    });
  }

  // Funktion zum Aufruf der API
  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.error = 'Bitte gib einen Suchbegriff ein.';
      this.results = null;
      return;
    }

    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['query'] ?? '';
      console.log('neue Anfrage: ', this.searchQuery);
      this.results$ = this.mediaService.getMultiSearchResults(this.searchQuery);
    });

    this.error = null; // Zurücksetzen von Fehlern
    const apiUrl = `${ROUTE_MULTI_SEARCH}${encodeURIComponent(
      this.searchQuery
    )}`;

    this.results$ = this.mediaService.getMultiSearchResults(this.searchQuery);
    //   .subscribe({
    //     next: (response) => {
    //       this.results = response; // Ergebnisse speichern
    //     },
    //     error: (err) => {
    //       this.error = 'Fehler beim Abrufen der Daten.';
    //       console.error(err);
    //     },
    //   });
  }
}
