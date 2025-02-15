import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  Film,
  MediaIDResponse,
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
  ROUTE_MEDIA_DETAILS_SEARCH_ONLY_TMDB,
  ROUTE_MEDIA_ID_FOR_MEDIA,
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

  getSeasonForTV = (
    mediaID: string,
    isMediaID: boolean
  ): Observable<Season> => {
    console.log('mediaID:', mediaID, ', is Media id:', isMediaID);

    let url: string = '';

    if (isMediaID) {
      // if given id === "media_id"
      url = ROUTE_MEDIA_DETAILS_SEARCH[0] + mediaID;
    } else {
      url = ROUTE_MEDIA_DETAILS_SEARCH_ONLY_TMDB + mediaID;
    }

    console.log('url in season:', url);

    return this.http.get<Season>(url).pipe(
      shareReplay(1),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  };

  public getFilmDetails = (tmdbMovieID: string): Observable<Film> => {
    return this.http
      .get<Film>(
        ROUTE_MOVIE_DETAILS_SEARCH[0] +
          tmdbMovieID +
          ROUTE_MOVIE_DETAILS_SEARCH[1]
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
