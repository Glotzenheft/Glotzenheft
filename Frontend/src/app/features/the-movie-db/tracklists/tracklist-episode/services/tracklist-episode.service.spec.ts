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
import {TracklistEpisodeDetailDataDto} from '../../tracklist/models/response/tracklist-season/tracklist-episode/tracklist-episode-detail-data.dto';
import {CreateTracklistEpisodeRequestDto} from '../models/request/create-tracklist-episode-request.dto';
import {TracklistEpisodeService} from './tracklist-episode.service';

describe('TracklistEpisodeService API contract', () => {
    let service: TracklistEpisodeService;
    let http: HttpTestingController;

    const dto: CreateTracklistEpisodeRequestDto = {
        tracklist_id: 42,
        tracklist_season_id: 50,
        episode_id: 60,
        watch_date_time: null,
    };
    const response: TracklistEpisodeDetailDataDto = {
        id: 70,
        createdAt: '2026-10-28 20:15:00',
        updatedAt: null,
        watchDateTime: null,
        episode: {
            id: 60,
            episodeNumber: 1,
            createdAt: '2026-10-28 19:00:00',
            updatedAt: null,
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(TracklistEpisodeService);
        http = TestBed.inject(HttpTestingController);
    });

    afterEach(() => http.verify());

    it('creates a sighting without a known watch date and returns its ID', () => {
        const received = jasmine.createSpy('received');
        service.createTracklistEpisode(dto).subscribe(received);

        const request = http.expectOne('/api/tracklist-episodes');
        expect(request.request.method).toBe('POST');
        expect(JSON.parse(request.request.serializeBody() as string)).toEqual(dto);
        request.flush(response, {status: 201, statusText: 'Created'});

        expect(received).toHaveBeenCalledOnceWith(response);
    });

    it('preserves local date strings and returns the updated sighting', () => {
        const watchDateTime = '2026-10-28 23:45:12';
        const received = jasmine.createSpy('received');
        service.updateTracklistEpisode(70, {watch_date_time: watchDateTime}).subscribe(received);

        const request = http.expectOne('/api/tracklist-episodes/70');
        expect(request.request.method).toBe('PATCH');
        expect(request.request.body).toEqual({watch_date_time: watchDateTime});
        request.flush({...response, watchDateTime});

        expect(received).toHaveBeenCalledOnceWith({...response, watchDateTime});
    });

    it('distinguishes clearing a watch date from leaving it unchanged', () => {
        service.updateTracklistEpisode(70, {watch_date_time: null}).subscribe();
        const clearRequest = http.expectOne('/api/tracklist-episodes/70');
        expect(JSON.parse(clearRequest.request.serializeBody() as string)).toEqual({watch_date_time: null});
        clearRequest.flush(response);

        service.updateTracklistEpisode(70, {}).subscribe();
        const unchangedRequest = http.expectOne('/api/tracklist-episodes/70');
        expect(JSON.parse(unchangedRequest.request.serializeBody() as string)).toEqual({});
        unchangedRequest.flush(response);
    });

    it('preserves the bulk endpoint and returns typed sightings for local updates', () => {
        const received = jasmine.createSpy('received');
        service.createBulkTracklistEpisodes({episodes: [dto]}).subscribe(received);

        const request = http.expectOne('/api/tracklist-episodes/bulk');
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual({episodes: [dto]});
        request.flush([response], {status: 201, statusText: 'Created'});

        expect(received).toHaveBeenCalledOnceWith([response]);
    });

    it('deletes by tracklist episode ID and accepts an empty response', () => {
        const completed = jasmine.createSpy('completed');
        service.deleteTracklistEpisode(70).subscribe({complete: completed});

        const request = http.expectOne('/api/tracklist-episodes/70');
        expect(request.request.method).toBe('DELETE');
        request.flush(null, {status: 204, statusText: 'No Content'});

        expect(completed).toHaveBeenCalledTimes(1);
    });

    it('forwards a conflict and permits a subsequent request', () => {
        const failed = jasmine.createSpy('failed');
        service.createTracklistEpisode(dto).subscribe({error: failed});
        http.expectOne('/api/tracklist-episodes').flush(
            {detail: 'Episode already tracked'},
            {status: 409, statusText: 'Conflict'},
        );
        expect(failed).toHaveBeenCalledTimes(1);

        const received = jasmine.createSpy('received');
        service.updateTracklistEpisode(70, {watch_date_time: null}).subscribe(received);
        http.expectOne('/api/tracklist-episodes/70').flush(response);
        expect(received).toHaveBeenCalledOnceWith(response);
    });
});
