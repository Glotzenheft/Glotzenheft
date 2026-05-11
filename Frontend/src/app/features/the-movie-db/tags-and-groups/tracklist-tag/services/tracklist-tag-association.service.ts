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
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TracklistTagAssociationService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/api';

    addTagToTracklist(tracklistId: number, tagId: number): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/tracklists/${tracklistId}/tags/${tagId}`, null);
    }

    addTracklistToTag(tagId: number, tracklistId: number): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/tags/${tagId}/tracklists/${tracklistId}`, null);
    }

    addTagsToTracklist(tracklistId: number, tagIds: number[]): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/tracklists/${tracklistId}/tags`, {
            tracklistTagIdsArray: tagIds
        });
    }

    addTracklistsToTag(tagId: number, tracklistIds: number[]): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/tags/${tagId}/tracklists`, {
            tracklistIdsArray: tracklistIds
        });
    }

    removeTagFromTracklist(tracklistId: number, tagId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/tracklists/${tracklistId}/tags/${tagId}`);
    }

    removeTracklistFromTag(tagId: number, tracklistId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/tags/${tagId}/tracklists/${tracklistId}`);
    }

    removeTracklistsFromTag(tagId: number, tracklistIds: number[]): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/tags/${tagId}/tracklists`, {
            body: { tracklistIdsArray: tracklistIds }
        });
    }

    removeTagsFromTracklist(tracklistId: number, tagIds: number[]): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/tracklists/${tracklistId}/tags`, {
            body: { tracklistTagIdsArray: tagIds }
        });
    }
}
