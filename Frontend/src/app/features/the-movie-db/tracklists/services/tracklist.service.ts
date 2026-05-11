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
import {TracklistSearchResponseDto} from '../models/response/tracklist-search-response.dto';

@Injectable({
    providedIn: 'root'
})
export class TracklistService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/api/tracklists';

    search(query: string, page: number = 1): Observable<TracklistSearchResponseDto[]> {
        const params = new HttpParams()
            .set('q', query)
            .set('page', page.toString());

        return this.http.get<TracklistSearchResponseDto[]>(`${this.baseUrl}/search`, { params });
    }
}
