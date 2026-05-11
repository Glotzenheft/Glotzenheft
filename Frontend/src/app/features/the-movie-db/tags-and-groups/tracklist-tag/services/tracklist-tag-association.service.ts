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
