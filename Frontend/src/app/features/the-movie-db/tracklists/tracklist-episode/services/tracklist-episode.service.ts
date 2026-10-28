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

import { inject, Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CreateBulkTracklistEpisodeRequestDto} from '../models/request/create-bulk-tracklist-episode-request.dto';
import {CreateTracklistEpisodeRequestDto} from '../models/request/create-tracklist-episode-request.dto';
import {UpdateTracklistEpisodeRequestDto} from '../models/request/update-tracklist-episode-request.dto';
import {TracklistEpisodeDetailDataDto} from '../../tracklist/models/response/tracklist-season/tracklist-episode/tracklist-episode-detail-data.dto';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TracklistEpisodeService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/api/tracklist-episodes';

    createTracklistEpisode(
        dto: CreateTracklistEpisodeRequestDto,
    ): Observable<TracklistEpisodeDetailDataDto> {
        return this.http.post<TracklistEpisodeDetailDataDto>(this.baseUrl, dto);
    }

    createBulkTracklistEpisodes(
        dto: CreateBulkTracklistEpisodeRequestDto,
    ): Observable<TracklistEpisodeDetailDataDto[]> {
        return this.http.post<TracklistEpisodeDetailDataDto[]>(`${this.baseUrl}/bulk`, dto);
    }

    updateTracklistEpisode(
        tracklistEpisodeId: number,
        dto: UpdateTracklistEpisodeRequestDto,
    ): Observable<TracklistEpisodeDetailDataDto> {
        return this.http.patch<TracklistEpisodeDetailDataDto>(`${this.baseUrl}/${tracklistEpisodeId}`, dto);
    }

    deleteTracklistEpisode(tracklistEpisodeId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${tracklistEpisodeId}`);
    }
}
