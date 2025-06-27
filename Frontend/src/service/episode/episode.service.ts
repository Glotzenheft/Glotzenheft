import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MediaService } from '../media/media.service';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';
import { CreateTracklistEpisode } from '../../app/shared/interfaces/tracklist-episode-interfaces';
import { ROUTE_CREATE_TRACKLIST_EPISODE, ROUTE_DELETE_TRACKLIST_EPISODE, ROUTE_UPDATE_TRACKLIST_EPISODE } from '../../app/shared/variables/api-routes';

@Injectable({
    providedIn: 'root',
})
export class EpisodeService {
    constructor(private http: HttpClient, private mediaService: MediaService) { }

    public createTracklistEpisode = (
        tracklistEpisode: CreateTracklistEpisode
    ): Observable<any> | null => {
        const header = this.mediaService.getHeader();

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
        const header = this.mediaService.getHeader();

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
        const header = this.mediaService.getHeader();

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
