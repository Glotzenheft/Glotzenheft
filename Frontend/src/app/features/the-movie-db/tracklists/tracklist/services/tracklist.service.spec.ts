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

import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {MediaType} from '../../../media/models/enums/media-type.enum';
import {TracklistStatusEnum} from '../models/enums/tracklist-status.enum';
import {CreateTracklistRequestDto} from '../models/request/create-tracklist-request.dto';
import {UpdateTracklistRequestDto} from '../models/request/update-tracklist-request.dto';
import {TracklistLightResponseDto} from '../models/response/tracklist-light-response.dto';
import {TracklistResponseDto} from '../models/response/tracklist-response.dto';
import {TracklistService} from './tracklist.service';

describe('TracklistService API contract', () => {
    let service: TracklistService;
    let http: HttpTestingController;

    const movieRequest: CreateTracklistRequestDto = {
        media_id: 10,
        media_type: MediaType.MOVIE,
        tracklist_name: 'Movie rewatch',
        tracklist_status: TracklistStatusEnum.WATCHING,
        is_rewatching: true,
        tracklist_start_date: '2026-10-28 20:15:00',
        comment: 'Movie notes',
    };
    const lightResponse: TracklistLightResponseDto = {
        id: 42,
        tracklistName: 'Movie rewatch',
        status: TracklistStatusEnum.WATCHING,
        isRewatching: true,
        rating: null,
        startDate: '2026-10-28 20:15:00',
        finishDate: null,
        customAirDate: null,
        language: null,
        subtitle: null,
        customPosterPath: null,
        createdAt: '2026-10-28 20:15:00',
        updatedAt: null,
        tags: [],
        media: {
            id: 10,
            type: MediaType.MOVIE,
            posterPath: null,
            createdAt: '2026-10-28 19:00:00',
            updatedAt: null,
        },
    };
    const response: TracklistResponseDto = {
        ...lightResponse,
        comment: 'Movie notes',
        tracklistSeason: null,
    };
    const seriesResponse: TracklistResponseDto = {
        ...response,
        id: 43,
        tracklistName: 'Series specials',
        status: TracklistStatusEnum.PLAN_TO_WATCH,
        isRewatching: false,
        startDate: null,
        comment: 'Watch these separately',
        customAirDate: '2026-10-28',
        language: 'ja',
        subtitle: 'de',
        customPosterPath: '/custom.jpg',
        media: {...response.media, id: 11, type: MediaType.TV_SHOW},
        tracklistSeason: {
            id: 50,
            createdAt: '2026-10-28 20:15:00',
            updatedAt: null,
            startEpisodeNumber: 2,
            endEpisodeNumber: 4,
            customSeasonNumber: 0,
            customPartNumber: null,
            season: {id: 20, seasonNumber: 0, createdAt: '2026-10-28 19:00:00', updatedAt: null},
            tracklistEpisodes: [],
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(TracklistService);
        http = TestBed.inject(HttpTestingController);
    });

    afterEach(() => http.verify());

    it('loads the lightweight tracklists returned by the collection endpoint', () => {
        const received = jasmine.createSpy('received');
        service.getAllTracklists().subscribe(received);

        const request = http.expectOne('/api/tracklists');
        expect(request.request.method).toBe('GET');
        request.flush([lightResponse]);

        expect(received).toHaveBeenCalledOnceWith([lightResponse]);
    });

    it('loads complete series details including tracked episodes without a media request', () => {
        const received = jasmine.createSpy('received');
        const details: TracklistResponseDto = {
            ...seriesResponse,
            tracklistSeason: {
                ...seriesResponse.tracklistSeason!,
                tracklistEpisodes: [{
                    id: 70,
                    createdAt: '2026-10-28 20:15:00',
                    updatedAt: null,
                    watchDateTime: null,
                    episode: {id: 60, episodeNumber: 2, createdAt: '2026-10-28 19:00:00', updatedAt: null},
                }],
            },
        };
        service.getTracklist(43).subscribe(received);

        const request = http.expectOne('/api/tracklists/43');
        expect(request.request.method).toBe('GET');
        request.flush(details);

        expect(received).toHaveBeenCalledOnceWith(details);
    });

    it('creates a movie and returns its comment and null season', () => {
        const received = jasmine.createSpy('received');
        service.createTracklist(movieRequest).subscribe(received);

        const request = http.expectOne('/api/tracklists');
        expect(request.request.method).toBe('POST');
        expect(JSON.parse(request.request.serializeBody() as string)).toEqual(movieRequest);
        request.flush(response, {status: 201, statusText: 'Created'});

        expect(received).toHaveBeenCalledOnceWith(response);
    });

    it('sends the season ID, episode range and optional metadata for a series', () => {
        const dto: CreateTracklistRequestDto = {
            media_id: 11,
            media_type: MediaType.TV_SHOW,
            season_id: 20,
            tracklist_name: 'Series specials',
            tracklist_status: TracklistStatusEnum.PLAN_TO_WATCH,
            tracklist_rating: null,
            tracklist_start_date: null,
            tracklist_finish_date: null,
            is_rewatching: false,
            comment: 'Watch these separately',
            custom_air_date: '2026-10-28',
            language: 'ja',
            subtitle: 'de',
            custom_poster_path: '/custom.jpg',
            start_episode_number: 2,
            end_episode_number: 4,
            custom_season_number: 0,
            custom_part_number: null,
        };
        const received = jasmine.createSpy('received');
        service.createTracklist(dto).subscribe(received);

        const request = http.expectOne('/api/tracklists');
        expect(request.request.method).toBe('POST');
        expect(JSON.parse(request.request.serializeBody() as string)).toEqual(dto);
        request.flush(seriesResponse, {status: 201, statusText: 'Created'});

        expect(received).toHaveBeenCalledOnceWith(seriesResponse);
    });

    it('preserves explicit null, false and zero in PATCH without adding omitted fields', () => {
        const patch: UpdateTracklistRequestDto = {
            comment: null,
            tracklist_finish_date: null,
            is_rewatching: false,
            custom_season_number: 0,
        };
        const received = jasmine.createSpy('received');
        service.updateTracklist(43, patch).subscribe(received);

        const request = http.expectOne('/api/tracklists/43');
        expect(request.request.method).toBe('PATCH');
        expect(JSON.parse(request.request.serializeBody() as string)).toEqual(patch);
        request.flush({...seriesResponse, comment: null});

        expect(received).toHaveBeenCalledOnceWith({...seriesResponse, comment: null});
    });

    it('completes deletion with an empty 204 response', () => {
        const completed = jasmine.createSpy('completed');
        service.deleteTracklist(42).subscribe({complete: completed});

        const request = http.expectOne('/api/tracklists/42');
        expect(request.request.method).toBe('DELETE');
        request.flush(null, {status: 204, statusText: 'No Content'});

        expect(completed).toHaveBeenCalledTimes(1);
    });

    it('allows an immediate new save after a failed request', () => {
        const failed = jasmine.createSpy('failed');
        const received = jasmine.createSpy('received');
        service.updateTracklist(42, {tracklist_name: ''}).subscribe({error: failed});
        http.expectOne('/api/tracklists/42').flush(
            {detail: 'Invalid name'},
            {status: 422, statusText: 'Unprocessable Entity'},
        );
        expect(failed).toHaveBeenCalledTimes(1);

        service.updateTracklist(42, {tracklist_name: 'Corrected name'}).subscribe(received);
        http.expectOne('/api/tracklists/42').flush({...response, tracklistName: 'Corrected name'});
        expect(received).toHaveBeenCalledOnceWith({...response, tracklistName: 'Corrected name'});
    });

    it('keeps requests independent while another write is pending', () => {
        const first = jasmine.createSpy('first');
        const second = jasmine.createSpy('second');
        service.createTracklist(movieRequest).subscribe(first);
        service.createTracklist({...movieRequest, tracklist_name: 'Another viewing'}).subscribe(second);

        const requests = http.match('/api/tracklists');
        expect(requests.length).toBe(2);
        requests[1].flush({...response, id: 43});
        requests[0].flush(response);

        expect(first).toHaveBeenCalledOnceWith(response);
        expect(second).toHaveBeenCalledOnceWith({...response, id: 43});
    });

    it('preserves the existing search API and its default page', () => {
        service.search('Film & Serie').subscribe();

        const request = http.expectOne(req => req.url === '/api/tracklists/search');
        expect(request.request.method).toBe('GET');
        expect(request.request.params.get('q')).toBe('Film & Serie');
        expect(request.request.params.get('page')).toBe('1');
        request.flush({results: [], page: 1, total_results: 0, total_pages: 0});
    });
});
