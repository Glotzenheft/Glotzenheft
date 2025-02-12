import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  Film,
  Season,
  TrackListCreation,
} from '../../shared/interfaces/media-interfaces';
import {
  BehaviorSubject,
  catchError,
  Observable,
  shareReplay,
  throwError,
} from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {
  ROUTE_CREATE_NEW_TRACKLIST,
  ROUTE_MEDIA_DETAILS_SEARCH,
  ROUTE_MOVIE_DETAILS_SEARCH,
  ROUTE_MULTI_SEARCH,
} from '../../shared/variables/api-routes';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getHeader = (): HttpHeaders | null => {
    let userToken: string = '';

    if (isPlatformBrowser(this.platformId)) {
      userToken = localStorage.getItem('token') ?? '';
    }

    if (!userToken.trim()) {
      return null;
    }

    return new HttpHeaders({
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    });
  };

  getAllFilms = (): Observable<Film[]> => {
    return this.http.get<Film[]>('');
  };

  getSeasonForTV = (mediaID: string, isMovie: boolean): Observable<Season> => {
    if (isMovie) {
      return this.http
        .post<any>(
          ROUTE_MOVIE_DETAILS_SEARCH + mediaID,
          JSON.stringify({ mediaID })
        )
        .pipe(
          shareReplay(1),
          catchError((error: HttpErrorResponse) => {
            return throwError(() => error);
          })
        );
    }

    return this.http
      .post<Season>(
        ROUTE_MEDIA_DETAILS_SEARCH + mediaID,
        JSON.stringify({ mediaID })
      )
      .pipe(
        shareReplay(1),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };

  getMultiSearchResults = (searchString: string): Observable<any> => {
    // const hheaders: HttpHeaders | null = this.getHeader();

    // console.log('multisearch headers: ', hheaders?.get('Authorization'));

    // if (hheaders !== null) {
    //   return this.http
    //     .get(`${ROUTE_MULTI_SEARCH}${encodeURIComponent(searchString)}`, {
    //       headers: hheaders,
    //     })
    //     .pipe(shareReplay(1));
    // }

    return this.http
      .get(`${ROUTE_MULTI_SEARCH}${encodeURIComponent(searchString)}`)
      .pipe(shareReplay(1));
  };

  public createNewTracklist = (
    tracklist: TrackListCreation
  ): Observable<any> => {
    return this.http
      .post<any>(ROUTE_CREATE_NEW_TRACKLIST, JSON.stringify(tracklist))
      .pipe(
        shareReplay(1),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };
}
