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
