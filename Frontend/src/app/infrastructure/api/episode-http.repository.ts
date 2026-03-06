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

import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CreateTracklistEpisode, UpdateTracklistEpisode} from '../../shared/interfaces/tracklist-episode-interfaces';
import {catchError, Observable, shareReplay, throwError} from 'rxjs';
import {
    ROUTE_DELETE_TRACKLIST_EPISODE, ROUTE_TRACKLIST_EPISODES,
} from '../../shared/variables/api-routes';
import {I_EpisodeRepository} from '../../core/interfaces/episode.repository';
import {UC_GetHeader} from '../../core/use-cases/media/get-header.use-case';

@Injectable({
    providedIn: 'root',
})
export class R_EpisodeHttp implements I_EpisodeRepository {
    constructor(
        private http: HttpClient,
        private getHeaderUseCase: UC_GetHeader,
    ) {}

    public createTracklistEpisode = (
        tracklistEpisode: CreateTracklistEpisode,
    ): Observable<any> | null => {
        const header = this.getHeaderUseCase.execute();

        if (!header) {
            return null;
        }

        const body = {
            tracklist_id: tracklistEpisode.tracklistId,
            tracklist_season_id: tracklistEpisode.tracklistSeasonId,
            episode_id: tracklistEpisode.episodeId,
            watch_date_time: tracklistEpisode.watchDateTime,
        };

        return this.http.post<any>(ROUTE_TRACKLIST_EPISODES, body, { headers: header }).pipe(
            shareReplay(1),
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            }),
        );
    };

    public updateTracklistEpisode = (
        tracklistEpisode: UpdateTracklistEpisode,
    ): Observable<any> | null => {
        const header = this.getHeaderUseCase.execute();

        if (!header) {
            return null;
        }

        const body = {
            watch_date_time: tracklistEpisode.watchDateTime
        }

        const url: string = ROUTE_TRACKLIST_EPISODES + '/' + tracklistEpisode.tracklistEpisodeId;

        return this.http.patch<any>(url, body, { headers: header }).pipe(
            shareReplay(1),
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            }),
        );
    };

    public deleteTracklistEpisode = (
        tracklistId: number,
        tracklistSeasonId: number,
        tracklistEpisodeId: number,
    ): Observable<any> | null => {
        const header = this.getHeaderUseCase.execute();

        if (!header) {
            return null;
        }

        const url: string =
            ROUTE_DELETE_TRACKLIST_EPISODE[0] +
            tracklistId +
            ROUTE_DELETE_TRACKLIST_EPISODE[1] +
            tracklistSeasonId +
            ROUTE_DELETE_TRACKLIST_EPISODE[2] +
            tracklistEpisodeId;

        return this.http.delete<any>(url, { headers: header }).pipe(
            shareReplay(1),
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            }),
        );
    };
}
