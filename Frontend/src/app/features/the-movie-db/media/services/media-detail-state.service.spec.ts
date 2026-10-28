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

import { MediaType } from '../models/enums/media-type.enum';
import { createMediaDetailResponse, createTracklistResponse } from '../testing/media-detail.fixtures';
import { MediaDetailStateService } from './media-detail-state.service';

describe('MediaDetailStateService', () => {
    it('adds a tracklist locally while preserving media data and the loaded view', () => {
        // Arrange
        const state = new MediaDetailStateService();
        const original = createMediaDetailResponse();
        Object.freeze(original.tracklists);
        Object.freeze(original.media);
        Object.freeze(original);
        state.setMedia(original);
        const tracklist = createTracklistResponse();

        // Act
        state.upsertTracklist(tracklist);

        // Assert
        expect(state.mediaData()?.tracklists).toEqual([tracklist]);
        expect(state.mediaData()?.media).toBe(original.media);
        expect(original.tracklists).toEqual([]);
        expect(state.isLoading()).toBeFalse();
        expect(state.viewState().error).toBeNull();
    });

    it('replaces a saved tracklist in its existing position without duplicating it', () => {
        // Arrange
        const first = createTracklistResponse();
        const second = createTracklistResponse({ id: 43, tracklistName: 'Another viewing' });
        const original = createMediaDetailResponse([first, second]);
        const state = new MediaDetailStateService();
        state.setMedia(original);
        const updated = { ...first, tracklistName: 'Renamed', rating: 10, comment: null };

        // Act
        state.upsertTracklist(updated);

        // Assert
        expect(state.mediaData()?.tracklists).toEqual([updated, second]);
        expect(state.mediaData()?.tracklists[1]).toBe(second);
        expect(original.tracklists).toEqual([first, second]);
        expect(state.isLoading()).toBeFalse();
    });

    it('removes a tracklist without changing the original array or other tracklists', () => {
        // Arrange
        const first = createTracklistResponse();
        const second = createTracklistResponse({ id: 43 });
        const original = createMediaDetailResponse([first, second]);
        const state = new MediaDetailStateService();
        state.setMedia(original);

        // Act
        state.removeTracklist(42);

        // Assert
        expect(state.mediaData()?.tracklists).toEqual([second]);
        expect(original.tracklists).toEqual([first, second]);
        expect(state.isLoading()).toBeFalse();
    });

    it('ignores late results for another medium or media type', () => {
        // Arrange
        const state = new MediaDetailStateService();
        const data = createMediaDetailResponse();
        state.setMedia(data);
        const tracklist = createTracklistResponse();

        // Act
        state.upsertTracklist({ ...tracklist, media: { ...tracklist.media, id: 99 } });
        state.upsertTracklist({ ...tracklist, media: { ...tracklist.media, type: MediaType.TV_SHOW } });
        state.removeTracklist(999);

        // Assert
        expect(state.mediaData()).toBe(data);
    });

    it('ignores changes when no medium is loaded', () => {
        // Arrange
        const state = new MediaDetailStateService();

        // Act
        state.upsertTracklist(createTracklistResponse());
        state.removeTracklist(42);

        // Assert
        expect(state.mediaData()).toBeNull();
        expect(state.isLoading()).toBeTrue();
    });

    it('clears old data when loading another medium and recovers after a load error', () => {
        // Arrange
        const state = new MediaDetailStateService();
        state.setMedia(createMediaDetailResponse([createTracklistResponse()]));

        // Act
        state.startLoading();
        const whileLoading = state.viewState();
        state.setLoadError('Loading failed');
        const afterError = state.viewState();
        state.startLoading();
        const retrying = state.viewState();
        const next = createMediaDetailResponse([], { id: 20 });
        state.setMedia(next);

        // Assert
        expect(whileLoading).toEqual({ data: null, loading: true, error: null });
        expect(afterError).toEqual({ data: null, loading: false, error: 'Loading failed' });
        expect(retrying).toEqual({ data: null, loading: true, error: null });
        expect(state.viewState()).toEqual({ data: next, loading: false, error: null });
    });
});
