/*
All files are part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>. w

Alle Dateien sind Teil vom Glotzenheft.

Glotzenheft ist Freie Software: Sie können es unter den Bedingungen
der GNU General Public License, wie von der Free Software Foundation,
Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
veröffentlichten Version, weiter verteilen und/oder modifizieren.

Glotzenheft wird in der Hoffnung, dass es nützlich sein wird, aber
OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
Siehe die GNU General Public License für weitere Details.

Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
*/

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
