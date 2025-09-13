/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
    catchError,
    EMPTY,
    exhaustMap,
    Observable,
    of,
    shareReplay,
    Subject,
    throttleTime,
    throwError,
} from 'rxjs';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import {
    Film,
    MediaIDResponse,
    Season,
    UpdateTracklistRequest,
} from '../../shared/interfaces/media-interfaces';
import {
    CreateMovieTracklistData,
    CreateSeasonTracklistData,
    Tracklist,
} from '../../shared/interfaces/tracklist-interfaces';
import { REQUEST_THROTTLE_TIME } from '../../shared/variables/message-vars';
import { KEY_LOCAL_STORAGE_LAST_AUTH_TOKEN } from '../../shared/variables/local-storage-keys';
import {
    ROUTE_CHECK_USER_AUTH,
    ROUTE_CREATE_NEW_TRACKLIST,
    ROUTE_DELETE_TRACKLIST,
    ROUTE_GET_ALL_USER_TRACKLISTS,
    ROUTE_GET_MOVIE_RECOMMENDATIONS,
    ROUTE_GET_TV_RECOMMENDATIONS,
    ROUTE_MEDIA_DETAILS_SEARCH,
    ROUTE_MEDIA_ID_FOR_MEDIA,
    ROUTE_MOVIE_DETAILS_SEARCH,
    ROUTE_MULTI_SEARCH,
    ROUTE_UPDATE_TRACKLIST,
} from '../../shared/variables/api-routes';
import { I_MediaRepository } from '../../core/interfaces/media.repository';
import {
    I_APIRecommendationResponse,
    I_HighestRecommendations,
    I_Recommendations,
} from '../../shared/interfaces/recommendation-interfaces';

@Injectable({
    providedIn: 'root',
})
export class R_MediaHttp implements I_MediaRepository {
    // tracklist update subject triggers new http request and controls request frequence (via throttle time)
    private tracklistUPDATESubject: Subject<UpdateTracklistRequest> =
        new Subject<UpdateTracklistRequest>();
    // getting the response for the update tracklist request (new value whenever update subject is renewed)
    private tracklistUPDATEResponseSubject: Subject<Tracklist> =
        new Subject<Tracklist>();

    private tracklistDELETESubject: Subject<number> = new Subject<number>();
    private tracklistDELETEResponseSubject: Subject<any> = new Subject<any>();

    private tracklistCREATEMOVIESubject: Subject<CreateMovieTracklistData> =
        new Subject<CreateMovieTracklistData>();
    private tracklistCREATEMOVIEResponseSubject: Subject<any> =
        new Subject<any>();

    private tracklistCREATESEASONSubject: Subject<CreateSeasonTracklistData> =
        new Subject<CreateSeasonTracklistData>();
    private tracklistCREATESEASONResponseSubject: Subject<Tracklist> =
        new Subject<Tracklist>();

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        // controlling the request frequence (via throttle time)
        this.tracklistUPDATESubject
            .pipe(
                throttleTime(REQUEST_THROTTLE_TIME), // wait 10 s
                exhaustMap((tracklistData) =>
                    this.updateTracklist(tracklistData),
                ), // Führt den HTTP-Request aus
                shareReplay(1), // Verhindert, dass der Request mehrmals ausgeführt wird
            )
            .subscribe({
                // updating the response subject (response subject will return new response value to the components)
                next: (response) =>
                    this.tracklistUPDATEResponseSubject.next(response), // Antwort an den Component weitergeben
                error: (error) =>
                    this.tracklistUPDATEResponseSubject.error(error), // Fehler an den Component weitergeben
            });

        // deleting tracklist --------------------------------------------------
        this.tracklistDELETESubject
            .pipe(
                throttleTime(REQUEST_THROTTLE_TIME),
                exhaustMap((tracklistID) => this.deleteTracklist(tracklistID)),
                shareReplay(1),
            )
            .subscribe({
                next: (response) =>
                    this.tracklistDELETEResponseSubject.next(response),
                error: (error) =>
                    this.tracklistDELETEResponseSubject.error(error),
            });

        // creating a new movie tracklist ---------------------------------------------------
        this.tracklistCREATEMOVIESubject
            .pipe(
                throttleTime(REQUEST_THROTTLE_TIME), // 20.000 ms
                exhaustMap((tracklistData: CreateMovieTracklistData) =>
                    this.createNewMovieTracklist(tracklistData),
                ),
                shareReplay(1),
            )
            .subscribe({
                next: (res: any) =>
                    this.tracklistCREATEMOVIEResponseSubject.next(res),
                error: (err: any) =>
                    this.tracklistCREATEMOVIEResponseSubject.error(err),
            });

        // create a new season tracklist ----------------------------------------------
        this.tracklistCREATESEASONSubject
            .pipe(
                throttleTime(REQUEST_THROTTLE_TIME),
                exhaustMap((tracklistData: CreateSeasonTracklistData) =>
                    this.createNewSeasonTracklist(tracklistData),
                ),
                shareReplay(1),
            )
            .subscribe({
                next: (res: Tracklist) =>
                    this.tracklistCREATESEASONResponseSubject.next(res),
                error: (err: any) =>
                    this.tracklistCREATESEASONResponseSubject.error(err),
            });
    }

    // functions ---------------------------------------------------------------------------------------
    public getUserToken = (): string | null => {
        let userToken: string | null = null;

        if (isPlatformBrowser(this.platformId)) {
            userToken = localStorage.getItem(KEY_LOCAL_STORAGE_LAST_AUTH_TOKEN);
        }
        if (!userToken) return null;

        return userToken;
    };

    public getHeader = (): HttpHeaders | null => {
        let userToken: string = '';

        if (isPlatformBrowser(this.platformId)) {
            userToken =
                localStorage.getItem(KEY_LOCAL_STORAGE_LAST_AUTH_TOKEN) ?? '';
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
        isMovie: boolean,
    ): Observable<MediaIDResponse> => {
        const header = this.getHeader();
        if (!header) {
            return EMPTY;
        }

        const movieType: string = isMovie ? 'movie' : 'tv';
        const url: string = `${ROUTE_MEDIA_ID_FOR_MEDIA[0]}${tmdbID}${ROUTE_MEDIA_ID_FOR_MEDIA[1]}${movieType}`;

        return this.http.get<MediaIDResponse>(url, { headers: header }).pipe(
            shareReplay(1),
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            }),
        );
    };

    public getSeasonForTV = (mediaID: string): Observable<Season> | null => {
        const header = this.getHeader();

        if (!header) {
            return null;
        }

        let url = ROUTE_MEDIA_DETAILS_SEARCH[0] + mediaID;

        return this.http.get<Season>(url, { headers: header }).pipe(
            shareReplay(1),
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            }),
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
            }),
        );
    };

    public getMultiSearchResults = (
        searchString: string,
        page: number,
    ): Observable<any> => {
        const includeAdult = true;
        const language = 'de-DE';

        const url = [
            ROUTE_MULTI_SEARCH[0],
            ROUTE_MULTI_SEARCH[1],
            encodeURIComponent(searchString),
            ROUTE_MULTI_SEARCH[2],
            String(includeAdult),
            ROUTE_MULTI_SEARCH[3],
            language,
            ROUTE_MULTI_SEARCH[4],
            String(page),
        ].join('');

        return this.http.get(url).pipe(
            shareReplay(1),
            catchError((error: HttpErrorResponse) => throwError(() => error)),
        );
    };

    // functions for creating a new season tracklist ------------------------------------------------------------------

    public triggerTracklistCREATESEASONSubject = (
        // function for triggering a new request for creating a new season tracklist
        tracklistData: CreateSeasonTracklistData,
    ) => {
        // updating the subject with the new data -> new request will be triggered
        this.tracklistCREATESEASONSubject.next(tracklistData);
    };

    public getTracklistCREATESEASONResponseSubject =
        (): Observable<Tracklist> => {
            // function for getting the current response value from the create tracklist request as observable
            return this.tracklistCREATESEASONResponseSubject.asObservable();
        };

    public createNewSeasonTracklist = (
        // function for making the request to the backend for creating a new season tracklist
        data: CreateSeasonTracklistData,
    ): Observable<Tracklist> => {
        const header = this.getHeader();

        if (!header) {
            return EMPTY;
        }

        return this.http
            .post<Tracklist>(ROUTE_CREATE_NEW_TRACKLIST, data, {
                headers: header,
            })
            .pipe(
                shareReplay(1),
                catchError((error: HttpErrorResponse) => {
                    return throwError(() => error);
                }),
            );
    };

    // functions for creating a new movie tracklist --------------------------------------------

    public triggerTracklistCREATEMOVIESubject = (
        tracklistData: CreateMovieTracklistData,
    ) => {
        this.tracklistCREATEMOVIESubject.next(tracklistData);
    };

    public getTracklistCREATEMOVIESubjectResponse = (): Observable<any> => {
        return this.tracklistCREATEMOVIEResponseSubject.asObservable();
    };

    public createNewMovieTracklist = (
        data: CreateMovieTracklistData,
    ): Observable<any> => {
        const header = this.getHeader();

        if (!header) {
            return EMPTY;
        }

        return this.http
            .post<any>(ROUTE_CREATE_NEW_TRACKLIST, data, { headers: header })
            .pipe(
                shareReplay(1),
                catchError((error: HttpErrorResponse) => {
                    return throwError(() => error);
                }),
            );
    };

    // update tracklist functions -----------------------------------------------------------------------------------

    public triggerTracklistUPDATESubject = (
        tracklistData: UpdateTracklistRequest,
    ) => {
        this.tracklistUPDATESubject.next(tracklistData); // Schicke die Daten an den Subject
    };

    // Diese Methode gibt das Observable der Antwort zurück, um es im Component zu abonnieren
    public getTracklistUPDATEResponseSubject = (): Observable<Tracklist> => {
        return this.tracklistUPDATEResponseSubject.asObservable();
    };

    public updateTracklist = (
        tracklistData: UpdateTracklistRequest,
    ): Observable<Tracklist> => {
        const header = this.getHeader();

        if (!header) {
            return EMPTY;
        }

        return this.http
            .patch<Tracklist>(ROUTE_UPDATE_TRACKLIST, tracklistData, {
                headers: header,
            })
            .pipe(
                shareReplay(1),
                catchError((error: HttpErrorResponse) => {
                    return throwError(() => error);
                }),
            );
    };

    // functions for deleting tracklists ----------------------------------------------------------------

    public triggerTracklistDELETESubject = (tracklistID: number) => {
        this.tracklistDELETESubject.next(tracklistID);
    };

    public getTracklistDELETEResponseSubject = (): Observable<any> => {
        return this.tracklistDELETEResponseSubject.asObservable();
    };

    public deleteTracklist = (tracklistID: number): Observable<any> => {
        const header = this.getHeader();

        if (!header) {
            return EMPTY;
        }

        const url: string = ROUTE_DELETE_TRACKLIST + tracklistID;

        return this.http.delete(url, { headers: header }).pipe(
            shareReplay(1),
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            }),
        );
    };

    // other functions --------------------------------------------------------------------------------

    public getAllUserTracklists = (): Observable<Tracklist[] | null> => {
        const header = this.getHeader();

        if (!header) {
            return of(null);
        }

        return this.http
            .get<Tracklist[]>(ROUTE_GET_ALL_USER_TRACKLISTS, {
                headers: header,
            })
            .pipe(
                shareReplay(1),
                catchError((error: HttpErrorResponse) => {
                    return throwError(() => error);
                }),
            );
    };

    

    public getAPIRecommendations = (
        tmdbId: number,
        isMovie: boolean,
    ): Observable<I_APIRecommendationResponse | null> => {
        const headers = this.getHeader();

        if (!headers) return of(null);

        return this.http.get<I_APIRecommendationResponse>(
            `${isMovie ? ROUTE_GET_MOVIE_RECOMMENDATIONS : ROUTE_GET_TV_RECOMMENDATIONS}${tmdbId}`,
            { headers },
        );
    };

    public getHighestRecommendations =
        (): Observable<I_HighestRecommendations> => {
            const token = this.getUserToken();

            if (!token) return EMPTY;

            return this.http
                .post<I_HighestRecommendations>(
                    'http://127.0.0.1:80/highest-media',
                    { backendIP: ROUTE_CHECK_USER_AUTH, token },
                )
                .pipe(
                    shareReplay(1),
                    catchError((error: HttpErrorResponse) => {
                        return throwError(() => error);
                    }),
                );
        };
}
