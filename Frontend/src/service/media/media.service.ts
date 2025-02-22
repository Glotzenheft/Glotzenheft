import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  Film,
  MediaIDResponse,
  Season,
  UpdateTracklistRequest,
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
  ROUTE_UPDATE_TRACKLIST,
} from '../../shared/variables/api-routes';
import { isPlatformBrowser } from '@angular/common';
import { Tracklist } from '../../shared/interfaces/tracklist-interfaces';
import { start } from 'repl';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  public getHeader = (): HttpHeaders | null => {
    let userToken: string = '';

    if (isPlatformBrowser(this.platformId)) {
      userToken = localStorage.getItem('token') ?? '';
    }

    if (!userToken.trim()) {
      return null;
    }

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

    return this.http.get<MediaIDResponse>(url).pipe(
      shareReplay(1),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  };

  getSeasonForTV = (mediaID: string): Observable<Season> | null => {
    const header = this.getHeader();

    if (!header) {
      return null;
    }

    let url = ROUTE_MEDIA_DETAILS_SEARCH[0] + mediaID;

    return this.http.get<Season>(url, { headers: header }).pipe(
      shareReplay(1),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  };

  public getFilmDetails = (movieID: string): Observable<Film> | null => {
    const header = this.getHeader();

    if (!header) {
      return null;
    }

    let url = ROUTE_MOVIE_DETAILS_SEARCH[0] + movieID;

    return this.http.get<Film>(url, { headers: header }).pipe(
      shareReplay(1),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  };

  getMultiSearchResults = (searchString: string): Observable<any> => {
    return this.http
      .get(`${ROUTE_MULTI_SEARCH}${encodeURIComponent(searchString)}`)
      .pipe(shareReplay(1));
  };

  public createNewSeasonTracklist = (
    name: string,
    mediaID: number,
    seasonID: number,
    startDate: string,
    endDate: string | null,
    status: string | null,
    rating: number | null
  ): Observable<any> | null => {
    const header = this.getHeader();

    if (!header) {
      return null;
    }

    let formattedDate: string = '';
    let formattedEndDate: string = '';

    console.log('start date:', startDate, ', end date: ', endDate);

    if (startDate) {
      let startDateAsDate: Date = new Date(startDate);
      startDateAsDate.setDate(startDateAsDate.getDate() + 1);
      formattedDate = startDateAsDate.toISOString().split('T')[0];
    }

    if (endDate) {
      let endDateAsDate: Date = new Date(endDate);
      endDateAsDate.setDate(endDateAsDate.getDate() + 1);
      formattedEndDate = endDateAsDate.toISOString().split('T')[0];
    }

    let url: string =
      ROUTE_CREATE_NEW_TRACKLIST[0] +
      encodeURIComponent(name) +
      ROUTE_CREATE_NEW_TRACKLIST[1] +
      status +
      ROUTE_CREATE_NEW_TRACKLIST[2] +
      mediaID +
      ROUTE_CREATE_NEW_TRACKLIST[3] +
      seasonID +
      ROUTE_CREATE_NEW_TRACKLIST[4] +
      'tv' +
      ROUTE_CREATE_NEW_TRACKLIST[5] +
      formattedDate +
      ROUTE_CREATE_NEW_TRACKLIST[6] +
      formattedEndDate +
      ROUTE_CREATE_NEW_TRACKLIST[7] +
      `${rating ? rating : ''}`;

    console.log('url:', url);

    // if (!startDate.trim()) {
    //   url = `${ROUTE_CREATE_NEW_SEASON_TRACKLIST[0]}${name}${ROUTE_CREATE_NEW_SEASON_TRACKLIST[1]}watching${ROUTE_CREATE_NEW_SEASON_TRACKLIST[2]}${mediaID}${ROUTE_CREATE_NEW_SEASON_TRACKLIST[3]}${seasonID}${ROUTE_CREATE_NEW_SEASON_TRACKLIST[4]}tv${ROUTE_CREATE_NEW_SEASON_TRACKLIST[6]}${endDate}`;
    // } else if (!endDate.trim()) {
    //   url = `${ROUTE_CREATE_NEW_SEASON_TRACKLIST[0]}${name}${ROUTE_CREATE_NEW_SEASON_TRACKLIST[1]}watching${ROUTE_CREATE_NEW_SEASON_TRACKLIST[2]}${mediaID}${ROUTE_CREATE_NEW_SEASON_TRACKLIST[3]}${seasonID}${ROUTE_CREATE_NEW_SEASON_TRACKLIST[4]}tv${ROUTE_CREATE_NEW_SEASON_TRACKLIST[5]}${startDate}`;
    // }

    // if (!startDate.trim() && !endDate.trim()) {
    //   url = `${ROUTE_CREATE_NEW_SEASON_TRACKLIST[0]}${name}${ROUTE_CREATE_NEW_SEASON_TRACKLIST[1]}watching${ROUTE_CREATE_NEW_SEASON_TRACKLIST[2]}${mediaID}${ROUTE_CREATE_NEW_SEASON_TRACKLIST[3]}${seasonID}${ROUTE_CREATE_NEW_SEASON_TRACKLIST[4]}tv`;
    // }

    return this.http.post<any>(url, {}, { headers: header }).pipe(
      shareReplay(1),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  };

  public createNewMovieTracklist = (
    name: string,
    mediaID: number,
    startDate: string | null,
    endDate: string | null,
    status: string,
    rating: number | null
  ): Observable<any> | null => {
    const header = this.getHeader();

    if (!header) {
      return null;
    }

    let formattedDate: string = '';
    let formattedEndDate: string = '';

    console.log('start date:', startDate, ', end date: ', endDate);

    if (startDate) {
      let startDateAsDate: Date = new Date(startDate);
      startDateAsDate.setDate(startDateAsDate.getDate() + 1);
      formattedDate = startDateAsDate.toISOString().split('T')[0];
    }

    if (endDate) {
      let endDateAsDate: Date = new Date(endDate);
      endDateAsDate.setDate(endDateAsDate.getDate() + 1);
      formattedEndDate = endDateAsDate.toISOString().split('T')[0];
    }

    console.log(
      'formatted: start date, ',
      formattedDate,
      ', end date',
      formattedEndDate
    );

    const url: string = `${ROUTE_CREATE_NEW_TRACKLIST[0]}${encodeURIComponent(
      name
    )}${ROUTE_CREATE_NEW_TRACKLIST[1]}${status}${
      ROUTE_CREATE_NEW_TRACKLIST[2]
    }${mediaID}${ROUTE_CREATE_NEW_TRACKLIST[4]}movie${
      ROUTE_CREATE_NEW_TRACKLIST[5]
    }${formattedDate}${ROUTE_CREATE_NEW_TRACKLIST[6]}${formattedEndDate}${
      ROUTE_CREATE_NEW_TRACKLIST[7]
    }${rating ? rating : ''}`;

    return this.http.post<any>(url, {}, { headers: header }).pipe(
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

  public updateTracklist = (
    tracklistData: UpdateTracklistRequest
  ): Observable<any> | null => {
    const header = this.getHeader();

    if (!header) {
      return null;
    }

    let formattedStartDate: string = '';
    let formattedEndDate: string = '';

    if (tracklistData.tracklist_start_date) {
      let startDateAsDate: Date = new Date(tracklistData.tracklist_start_date);

      startDateAsDate.setDate(startDateAsDate.getDate() + 1);
      formattedStartDate = startDateAsDate.toISOString().split('T')[0];
    }

    if (tracklistData.tracklist_finish_date) {
      let endDateAsDate: Date = new Date(tracklistData.tracklist_finish_date);

      endDateAsDate.setDate(endDateAsDate.getDate() + 1);
      formattedEndDate = endDateAsDate.toISOString().split('T')[0];
    }

    const url: string =
      ROUTE_UPDATE_TRACKLIST[0] +
      tracklistData.tracklist_id +
      ROUTE_UPDATE_TRACKLIST[1] +
      tracklistData.tracklist_status +
      ROUTE_UPDATE_TRACKLIST[2] +
      encodeURIComponent(tracklistData.tracklist_name) +
      ROUTE_UPDATE_TRACKLIST[3] +
      tracklistData.tracklist_rating +
      ROUTE_UPDATE_TRACKLIST[4] +
      formattedStartDate +
      ROUTE_UPDATE_TRACKLIST[5] +
      formattedEndDate;

    return this.http.patch<any>(url, {}, { headers: header }).pipe(
      shareReplay(1),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  };
}
