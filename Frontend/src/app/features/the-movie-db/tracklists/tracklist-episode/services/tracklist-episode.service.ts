import { inject, Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CreateBulkTracklistEpisodeRequestDto} from '../models/request/create-bulk-tracklist-episode-request.dto';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TracklistEpisodeService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/api/tracklist-episodes';

    public createBulkTracklistEpisodes(dto: CreateBulkTracklistEpisodeRequestDto): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/bulk`, dto);
    }
}
