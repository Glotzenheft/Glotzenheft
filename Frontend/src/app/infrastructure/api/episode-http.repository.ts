import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateTracklistEpisode } from '../../shared/interfaces/tracklist-episode-interfaces';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';
import { ROUTE_CREATE_TRACKLIST_EPISODE, ROUTE_DELETE_TRACKLIST_EPISODE, ROUTE_UPDATE_TRACKLIST_EPISODE } from '../../shared/variables/api-routes';
import { I_EpisodeRepository } from '../../core/interfaces/episode.repository';
import { UC_GetHeader } from '../../core/use-cases/media/get-header.use-case';

@Injectable({
    providedIn: 'root',
})
export class R_EpisodeHttp implements I_EpisodeRepository {
    constructor(private http: HttpClient, private getHeaderUseCase: UC_GetHeader) { }

    public createTracklistEpisode = (
        tracklistEpisode: CreateTracklistEpisode
    ): Observable<any> | null => {
        const header = this.getHeaderUseCase.execute();

        if (!header) {
            return null;
        }

        const url: string =
            ROUTE_CREATE_TRACKLIST_EPISODE[0] +
            tracklistEpisode.tracklistSeasonID +
            ROUTE_CREATE_TRACKLIST_EPISODE[1] +
            tracklistEpisode.episodeID +
            ROUTE_CREATE_TRACKLIST_EPISODE[2] +
            tracklistEpisode.watchDate +
            ROUTE_CREATE_TRACKLIST_EPISODE[3] +
            tracklistEpisode.tracklistID;

        return this.http.post<any>(url, {}, { headers: header }).pipe(
            shareReplay(1),
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    };

    public updateTracklistEpisode = (
        tracklistEpisode: CreateTracklistEpisode
    ): Observable<any> | null => {
        const header = this.getHeaderUseCase.execute();

        if (!header) {
            return null;
        }

        const url: string =
            ROUTE_UPDATE_TRACKLIST_EPISODE[0] +
            tracklistEpisode.tracklistID +
            ROUTE_UPDATE_TRACKLIST_EPISODE[1] +
            tracklistEpisode.tracklistSeasonID +
            ROUTE_UPDATE_TRACKLIST_EPISODE[2] +
            tracklistEpisode.episodeID +
            ROUTE_UPDATE_TRACKLIST_EPISODE[3] +
            tracklistEpisode.watchDate;

        return this.http.patch<any>(url, {}, { headers: header }).pipe(
            shareReplay(1),
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    };

    public deleteTracklistEpisode = (
        tracklistID: number,
        tracklistSeasonID: number,
        tracklistEpisodeId: number
    ): Observable<any> | null => {
        const header = this.getHeaderUseCase.execute();

        if (!header) {
            return null;
        }

        const url: string =
            ROUTE_DELETE_TRACKLIST_EPISODE[0] +
            tracklistID +
            ROUTE_DELETE_TRACKLIST_EPISODE[1] +
            tracklistSeasonID +
            ROUTE_DELETE_TRACKLIST_EPISODE[2] +
            tracklistEpisodeId;

        return this.http.delete<any>(url, { headers: header }).pipe(
            shareReplay(1),
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    };
}
