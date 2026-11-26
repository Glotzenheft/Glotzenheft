import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PatchTracklistSeasonEpisodesRequestDto } from '../models/request/patch-tracklist-season-episodes-request.dto';
import { TracklistSeasonDetailDataDto } from '../models/response/tracklist-season/tracklist-season-detail-data.dto';

@Injectable({ providedIn: 'root' })
export class TracklistSeasonService {
    private readonly http = inject(HttpClient);
    private readonly url = '/api/tracklist-seasons';

    getSeason(id: number) {
        return this.http.get<TracklistSeasonDetailDataDto>(`${this.url}/${id}`);
    }

    patchEpisodes(id: number, body: PatchTracklistSeasonEpisodesRequestDto) {
        return this.http.patch<TracklistSeasonDetailDataDto>(`${this.url}/${id}/episodes`, body);
    }
}
