import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { createSeriesTracklist } from '../../../media/testing/media-detail.fixtures';
import { PatchTracklistSeasonEpisodesRequestDto } from '../models/request/patch-tracklist-season-episodes-request.dto';
import { TracklistSeasonService } from './tracklist-season.service';

describe('TracklistSeasonService API contract', () => {
    let service: TracklistSeasonService;
    let http: HttpTestingController;
    const url = '/api/tracklist-seasons/50';
    const body: PatchTracklistSeasonEpisodesRequestDto = {
        episodes: [
            { episode_id: 303, watched: true, watch_date_time: '2026-11-24 21:30:11' },
            { episode_id: 304, watched: true, watch_date_time: null },
            { episode_id: 305, watched: false },
        ],
    };
    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
        service = TestBed.inject(TracklistSeasonService);
        http = TestBed.inject(HttpTestingController);
    });
    afterEach(() => http.verify());
    it('sends only the requested states to the season PATCH and uses the full response', () => {
        const saved = jasmine.createSpy('saved');
        service.patchEpisodes(50, body).subscribe(saved);
        const req = http.expectOne({ method: 'PATCH', url: url + '/episodes' });
        expect(JSON.parse(req.request.serializeBody() as string)).toEqual(body);
        expect(req.request.headers.has('Prefer')).toBeFalse();
        const result = createSeriesTracklist().tracklistSeason!;
        req.flush(result);
        expect(saved).toHaveBeenCalledOnceWith(result);
    });
    for (const status of [404, 409, 422]) {
        it('propagates a rejected batch (' + status + ') without emitting a saved season', () => {
            const observer = { next: jasmine.createSpy(), error: jasmine.createSpy() };
            const invalid = {
                episodes: [{ episode_id: 304, watched: false, watch_date_time: '2026-11-25 10:20:30' }],
            };
            service
                .patchEpisodes(
                    50,
                    status === 422 ? (invalid as PatchTracklistSeasonEpisodesRequestDto) : body,
                )
                .subscribe(observer);
            http.expectOne({ method: 'PATCH', url: url + '/episodes' }).flush(
                {},
                { status, statusText: 'Rejected' },
            );
            expect(observer.next).not.toHaveBeenCalled();
            expect(observer.error).toHaveBeenCalledOnceWith(jasmine.objectContaining({ status }));
        });
    }
});
