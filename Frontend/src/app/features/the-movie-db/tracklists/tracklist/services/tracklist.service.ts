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

import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateTracklistRequestDto} from '../models/request/create-tracklist-request.dto';
import {UpdateTracklistRequestDto} from '../models/request/update-tracklist-request.dto';
import {TracklistLightResponseDto} from '../models/response/tracklist-light-response.dto';
import {TracklistSearchPaginatedResponseDto} from '../models/response/tracklist-search-paginated-response.dto';

@Injectable({
    providedIn: 'root'
})
export class TracklistService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/api/tracklists';

    getAllTracklists(): Observable<TracklistLightResponseDto[]> {
        return this.http.get<TracklistLightResponseDto[]>(this.baseUrl);
    }

    /** The response contains neither comment nor tracklistSeason. */
    createTracklist(dto: CreateTracklistRequestDto): Observable<TracklistLightResponseDto> {
        return this.http.post<TracklistLightResponseDto>(this.baseUrl, dto);
    }

    /** The response contains neither comment nor tracklistSeason. */
    updateTracklist(
        tracklistId: number,
        dto: UpdateTracklistRequestDto,
    ): Observable<TracklistLightResponseDto> {
        return this.http.patch<TracklistLightResponseDto>(`${this.baseUrl}/${tracklistId}`, dto);
    }

    deleteTracklist(tracklistId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${tracklistId}`);
    }

    search(query: string, page: number = 1): Observable<TracklistSearchPaginatedResponseDto> {
        const params = new HttpParams()
            .set('q', query)
            .set('page', page.toString());

        return this.http.get<TracklistSearchPaginatedResponseDto>(`${this.baseUrl}/search`, { params });
    }
}
