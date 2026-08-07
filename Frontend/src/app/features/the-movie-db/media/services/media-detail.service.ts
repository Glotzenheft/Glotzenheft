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
