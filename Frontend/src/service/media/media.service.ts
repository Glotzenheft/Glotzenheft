import { Injectable } from '@angular/core';
import { Film, Season } from '../../shared/interfaces/media-interfaces';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  ROUTE_MEDIA_DETAILS_SEARCH,
  ROUTE_MULTI_SEARCH,
} from '../../shared/variables/api-routes';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}

  getAllFilms = (): Observable<Film[]> => {
    return this.http.get<Film[]>('');
  };

  getSeasonForTV = (mediaID: string): Observable<Season> => {
    return this.http.post<Season>(
      ROUTE_MEDIA_DETAILS_SEARCH + mediaID,
      JSON.stringify({ mediaID })
    );
  };

  getMultiSearchResults = (searchString: string): Observable<any> => {
    return this.http
      .get(`${ROUTE_MULTI_SEARCH}${encodeURIComponent(searchString)}`)
      .pipe(shareReplay(1));
  };
}
