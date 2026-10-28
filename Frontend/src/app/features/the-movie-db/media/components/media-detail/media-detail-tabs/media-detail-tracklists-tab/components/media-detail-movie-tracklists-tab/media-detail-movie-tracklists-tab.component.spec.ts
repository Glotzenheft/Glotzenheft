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

import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { TracklistFormDialogResult } from '../../../../../../../tracklists/tracklist/models/tracklist-form-dialog-data';
import { TracklistFormDialogService } from '../../../../../../../tracklists/tracklist/services/tracklist-form-dialog.service';
import { MediaType } from '../../../../../../models/enums/media-type.enum';
import { MediaDetailStateService } from '../../../../../../services/media-detail-state.service';
import { MediaDetailService } from '../../../../../../services/media-detail.service';
import {
    createMediaDetailResponse,
    createTracklistResponse,
} from '../../../../../../testing/media-detail.fixtures';
import { MediaDetailMovieTracklistsTabComponent } from './media-detail-movie-tracklists-tab.component';

describe('MediaDetailMovieTracklistsTabComponent', () => {
    let dialogs: jasmine.SpyObj<TracklistFormDialogService>;
    let api: jasmine.SpyObj<MediaDetailService>;
    let state: MediaDetailStateService;
    let component: MediaDetailMovieTracklistsTabComponent;

    beforeEach(() => {
        dialogs = jasmine.createSpyObj<TracklistFormDialogService>('TracklistFormDialogService', ['open']);
        api = jasmine.createSpyObj<MediaDetailService>('MediaDetailService', ['getMedia']);
        TestBed.configureTestingModule({
            providers: [
                MediaDetailStateService,
                { provide: TracklistFormDialogService, useValue: dialogs },
                { provide: MediaDetailService, useValue: api },
            ],
        });
        state = TestBed.inject(MediaDetailStateService);
        component = TestBed.runInInjectionContext(() => new MediaDetailMovieTracklistsTabComponent());
        component.mediaData = createMediaDetailResponse();
        state.setMedia(component.mediaData);
    });

    it('opens creation with the current movie and immediately adds the saved result locally', () => {
        // Arrange
        const saved = createTracklistResponse();
        dialogs.open.and.returnValue(of({ action: 'saved', tracklist: saved }));
        const originalMedia = component.mediaData.media;

        // Act
        component.createTracklist();

        // Assert
        expect(dialogs.open).toHaveBeenCalledOnceWith({
            mode: 'create',
            mediaType: MediaType.MOVIE,
            media: originalMedia,
        });
        expect(state.mediaData()?.tracklists).toEqual([saved]);
        expect(state.mediaData()?.media).toBe(originalMedia);
        expect(state.isLoading()).toBeFalse();
        expect(api.getMedia).not.toHaveBeenCalled();
    });

    it('opens editing with the full tracklist and replaces the saved result in place', () => {
        // Arrange
        const original = createTracklistResponse();
        const second = createTracklistResponse({ id: 43 });
        component.mediaData = createMediaDetailResponse([original, second]);
        state.setMedia(component.mediaData);
        const saved = { ...original, tracklistName: 'Edited name', rating: 10, comment: null };
        dialogs.open.and.returnValue(of({ action: 'saved', tracklist: saved }));

        // Act
        component.editTracklist(original);

        // Assert
        expect(dialogs.open).toHaveBeenCalledOnceWith({ mode: 'edit', tracklist: original });
        expect(state.mediaData()?.tracklists).toEqual([saved, second]);
        expect(state.isLoading()).toBeFalse();
        expect(api.getMedia).not.toHaveBeenCalled();
    });

    it('removes a deleted tracklist locally and returns to the empty list', () => {
        // Arrange
        const tracklist = createTracklistResponse();
        component.mediaData = createMediaDetailResponse([tracklist]);
        state.setMedia(component.mediaData);
        dialogs.open.and.returnValue(of({ action: 'deleted', tracklistId: tracklist.id }));

        // Act
        component.editTracklist(tracklist);

        // Assert
        expect(state.mediaData()?.tracklists).toEqual([]);
        expect(state.isLoading()).toBeFalse();
        expect(api.getMedia).not.toHaveBeenCalled();
    });

    it('preserves data when the dialog is cancelled', () => {
        // Arrange
        const original = state.mediaData();
        dialogs.open.and.returnValue(of(undefined));

        // Act
        component.createTracklist();

        // Assert
        expect(state.mediaData()).toBe(original);
        expect(api.getMedia).not.toHaveBeenCalled();
    });

    it('ignores an old dialog result after the current movie changes', () => {
        // Arrange
        const closed = new Subject<TracklistFormDialogResult | undefined>();
        dialogs.open.and.returnValue(closed);
        const next = createMediaDetailResponse([], { id: 20 });

        // Act
        component.createTracklist();
        state.setMedia(next);
        closed.next({ action: 'saved', tracklist: createTracklistResponse() });

        // Assert
        expect(state.mediaData()).toBe(next);
        expect(api.getMedia).not.toHaveBeenCalled();
    });

    it('stops observing dialog results when the tab is destroyed', () => {
        // Arrange
        const closed = new Subject<TracklistFormDialogResult | undefined>();
        dialogs.open.and.returnValue(closed);
        component.createTracklist();

        // Act
        TestBed.resetTestingModule();
        closed.next({ action: 'saved', tracklist: createTracklistResponse() });

        // Assert
        expect(closed.observed).toBeFalse();
        expect(state.mediaData()?.tracklists).toEqual([]);
    });

    it('prevents editing a tracklist belonging to another medium', () => {
        // Arrange
        const tracklist = createTracklistResponse();
        const foreign = { ...tracklist, media: { ...tracklist.media, id: 99 } };

        // Act
        component.editTracklist(foreign);

        // Assert
        expect(dialogs.open).not.toHaveBeenCalled();
        expect(api.getMedia).not.toHaveBeenCalled();
    });
});
