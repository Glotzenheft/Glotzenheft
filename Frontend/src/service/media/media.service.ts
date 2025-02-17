import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  Film,
  MediaIDResponse,
  Season,
  Tracklist,
  TrackListCreation,
} from '../../shared/interfaces/media-interfaces';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {
  ROUTE_CREATE_NEW_TRACKLIST,
  ROUTE_GET_ALL_USER_TRACKLISTS,
  ROUTE_MEDIA_DETAILS_SEARCH,
  ROUTE_MEDIA_ID_FOR_MEDIA,
  ROUTE_MOVIE_DETAILS_SEARCH,
  ROUTE_MULTI_SEARCH,
} from '../../shared/variables/api-routes';
import { isPlatformBrowser } from '@angular/common';
import { log } from 'console';

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

    console.log(userToken);

    return new HttpHeaders({
      Authorization: `Bearer ${userToken}`,
    });
  };

  getAllFilms = (): Observable<Film[]> => {
    return this.http.get<Film[]>('');
  };

  /**
   * For getting the mediaID from the database.
   
   *
   * @param tmdbID string
   * @param isMovie boolean
   * @returns
   */
  public getMediaIdForMedia = (
    /* 
    Function in the app: on multi search, the user clicks on the media (movie or tv) but there is only tmdb id available at this moment
    -> this function sends a request to the api -> media is created (if not) and mediaID will be returned
    */
    tmdbID: number,
    isMovie: boolean
  ): Observable<MediaIDResponse> => {
    const movieType: string = isMovie === true ? 'movie' : 'tv';
    const url: string = `${ROUTE_MEDIA_ID_FOR_MEDIA[0]}${tmdbID}${ROUTE_MEDIA_ID_FOR_MEDIA[1]}${movieType}`;

    console.log(url);

    return this.http.get<MediaIDResponse>(url).pipe(
      shareReplay(1),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  };

  getSeasonForTV = (mediaID: string): Observable<Season> => {
    let url = ROUTE_MEDIA_DETAILS_SEARCH[0] + mediaID;

    return this.http.get<Season>(url).pipe(
      shareReplay(1),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  };

  public getFilmDetails = (movieID: string): Observable<Film> => {
    let url = ROUTE_MOVIE_DETAILS_SEARCH[0] + movieID;

    return this.http.get<Film>(url).pipe(
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

  public getAllUserTracklists = (): Observable<Tracklist[]> | null => {
    const header = this.getHeader();

    if (!header) {
      return null;
    }

    console.log('header', header);

    return this.http
      .get<Tracklist[]>(ROUTE_GET_ALL_USER_TRACKLISTS, {
        headers: header,
      })
      .pipe(
        shareReplay(1),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  };
}
