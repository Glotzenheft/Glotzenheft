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
