import { Injectable } from '@angular/core';
import { Film, Season } from '../../shared/interfaces/media-interfaces';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}

  getAllFilms = (): Observable<Film[]> => {
    return this.http.get<Film[]>('');
  };

  getSeasonForTV = (mediaID: string, seasonID: string): Observable<Season> => {
    return this.http.post<Season>('', JSON.stringify({ mediaID, seasonID }));
  };
}
