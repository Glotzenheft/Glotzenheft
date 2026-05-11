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
