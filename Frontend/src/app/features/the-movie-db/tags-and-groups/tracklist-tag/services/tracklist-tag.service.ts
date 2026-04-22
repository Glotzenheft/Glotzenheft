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
import {HttpClient} from '@angular/common/http';
import {TracklistTagLightResponseDto} from '../models/response/tracklist-tag-light-response.dto';
import {Observable} from 'rxjs';
import {TracklistTagResponseDto} from '../models/response/tracklist-tag-response.dto';
import {CreateTracklistTagRequestDto} from '../models/request/create-tracklist-tag-request.dto';
import {UpdateTracklistTagRequestDto} from '../models/request/update-tracklist-tag-request.dto';

@Injectable({
    providedIn: 'root',
})
export class TracklistTagService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/api/tags';

    getTag(tagId: number):Observable<TracklistTagLightResponseDto> {
        return this.http.get<TracklistTagLightResponseDto>(`${this.baseUrl}/${tagId}`);
    }

    getAllTags(): Observable<TracklistTagLightResponseDto[]> {
        return this.http.get<TracklistTagLightResponseDto[]>(this.baseUrl);
    }

    getTagWithTracklists(tagId: number): Observable<TracklistTagResponseDto> {
        return this.http.get<TracklistTagResponseDto>(`${this.baseUrl}/${tagId}/tracklists`);
    }

    getAllTagsWithTracklists(): Observable<TracklistTagResponseDto[]> {
        return this.http.get<TracklistTagResponseDto[]>(`${this.baseUrl}/tracklists`);
    }

    createTag(dto: CreateTracklistTagRequestDto): Observable<TracklistTagLightResponseDto> {
        return this.http.post<TracklistTagLightResponseDto>(this.baseUrl, dto);
    }

    updateTag(tagId: number, dto: UpdateTracklistTagRequestDto): Observable<TracklistTagLightResponseDto> {
        return this.http.patch<TracklistTagLightResponseDto>(`${this.baseUrl}/${tagId}`, dto);
    }

    deleteTag(tagId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${tagId}`);
    }
}
