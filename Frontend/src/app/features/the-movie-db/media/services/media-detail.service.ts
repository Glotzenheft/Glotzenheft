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
import {MediaResponse} from '../models/response/media-response.dto';
import {MediaType} from '../models/enums/media-type.enum';

@Injectable({
    providedIn: 'root',
})
export class MediaDetailService {
    private readonly http: HttpClient = inject(HttpClient);

    getMedia(mediaType: string,mediaId: number):Observable<MediaResponse> {
        const endpoint = mediaType === MediaType.MOVIE
            ? '/api/movie'
            : '/api/tv';

        const params = new HttpParams().set('media_id', mediaId);

        return this.http.get<MediaResponse>(endpoint, {params});
    }
}
