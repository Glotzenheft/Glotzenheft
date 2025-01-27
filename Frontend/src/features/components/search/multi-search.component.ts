import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {JsonPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-multi-search',
  templateUrl: './multi-search.component.html',
  imports: [
    FormsModule,
    NgIf,
    JsonPipe,
  ],
  styleUrls: ['./multi-search.component.css']
})
export class MultiSearchComponent {
  searchQuery: string = ''; // Suchtext aus der Eingabe
  results: any = null;      // JSON-Ergebnisse
  error: string | null = null; // Fehleranzeige

  constructor(private http: HttpClient) {}

  // Funktion zum Aufruf der API
  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.error = 'Bitte gib einen Suchbegriff ein.';
      this.results = null;
      return;
    }

    this.error = null; // Zurücksetzen von Fehlern
    const apiUrl = `https://127.0.0.1:8000/api/multi-search?q=${encodeURIComponent(this.searchQuery)}`;

    this.http.get(apiUrl).subscribe({
      next: (response) => {
        this.results = response; // Ergebnisse speichern
      },
      error: (err) => {
        this.error = 'Fehler beim Abrufen der Daten.';
        console.error(err);
      }
    });
  }
}
