import { Injectable } from '@angular/core';
import { Film, Season } from '../../shared/interfaces/media-interfaces';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ROUTE_MULTI_SEARCH } from '../../shared/variables/api-routes';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  public showToast$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  triggerToast = () => {
    this.showToast$.next(true);
  };

  getAllFilms = (): Observable<Film[]> => {
    return this.http.get<Film[]>('');
  };

  getSeasonForTV = (mediaID: string, seasonID: string): Observable<Season> => {
    return this.http.post<Season>('', JSON.stringify({ mediaID, seasonID }));
  };

  getMultiSearchResults = (searchString: string): Observable<any> => {
    return this.http
      .get(`${ROUTE_MULTI_SEARCH}${encodeURIComponent(searchString)}`)
      .pipe(shareReplay(1));
  };
}
