import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule, JsonPipe, NgIf } from '@angular/common';
import { ROUTE_MULTI_SEARCH } from '../../../shared/variables/api-routes';
import { MediaService } from '../../../service/media/media.service';
import { Observable } from 'rxjs';
import { Card } from 'primeng/card';

interface MultiResult {
  backdrop_path: string;
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  media_type: string;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

interface MultiResponse {
  page: number;
  results: MultiResult[];
  total_results: 3;
  total_pages: 1;
}

@Component({
  selector: 'app-multi-search',
  templateUrl: './multi-search.component.html',
  imports: [FormsModule, CommonModule, AsyncPipe],
  styleUrls: ['./multi-search.component.css'],
})
export class MultiSearchComponent {
  searchQuery: string = ''; // Suchtext aus der Eingabe
  results: any = null; // JSON-Ergebnisse
  results$: Observable<MultiResponse> | null = null;
  error: string | null = null; // Fehleranzeige

  constructor(private http: HttpClient, private mediaService: MediaService) {}

  // Funktion zum Aufruf der API
  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.error = 'Bitte gib einen Suchbegriff ein.';
      this.results = null;
      return;
    }

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
