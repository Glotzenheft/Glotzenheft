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
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of, Subject, throwError } from 'rxjs';
import { MediaDetailStateService } from '../../../../../../services/media-detail-state.service';
import { MediaDetailService } from '../../../../../../services/media-detail.service';
import { TracklistFormDialogService } from '../../../../../../../tracklists/tracklist/services/tracklist-form-dialog.service';
import { TracklistSelectionService } from '../../../../../../../tracklists/tracklist/services/tracklist-selection.service';
import { TracklistService } from '../../../../../../../tracklists/tracklist/services/tracklist.service';
import { TracklistTagAssociationService } from '../../../../../../../tags-and-groups/tracklist-tag/services/tracklist-tag-association.service';
import { TracklistTagType } from '../../../../../../../tags-and-groups/tracklist-tag/models/tracklist-tag-type.enum';
import { TracklistTagLightResponseDto } from '../../../../../../../tags-and-groups/tracklist-tag/models/response/tracklist-tag-light-response.dto';
import {
    createSeriesMedia,
    createSeriesSeason,
    createSeriesTracklist,
    createSeriesEpisode,
    createEpisodeSighting,
} from '../../../../../../testing/media-detail.fixtures';
import { MediaDetailTvSeriesTracklistsTabComponent } from './media-detail-tv-series-tracklists-tab.component';

describe('MediaDetailTvSeriesTracklistsTabComponent', () => {
    let component: MediaDetailTvSeriesTracklistsTabComponent;
    let state: MediaDetailStateService;
    let forms: jasmine.SpyObj<TracklistFormDialogService>;
    let selections: jasmine.SpyObj<TracklistSelectionService>;
    let dialogs: jasmine.SpyObj<DialogService>;
    let tracklists: jasmine.SpyObj<TracklistService>;
    let associations: jasmine.SpyObj<TracklistTagAssociationService>;
    let mediaApi: jasmine.SpyObj<MediaDetailService>;
    let closed: Subject<unknown>;
    let ref: jasmine.SpyObj<DynamicDialogRef<unknown>>;

    const tag = (id: number): TracklistTagLightResponseDto => ({
        id,
        tagName: `Tag ${id}`,
        slug: `tag-${id}`,
        tracklistTagType: TracklistTagType.GENRE,
        color: '#fff',
        description: null,
        icon: null,
        isSpoiler: false,
        isAdult: false,
        createdAt: '2026-10-01 19:00:00',
        updatedAt: null,
    });

    beforeEach(() => {
        forms = jasmine.createSpyObj<TracklistFormDialogService>('TracklistFormDialogService', ['open']);
        selections = jasmine.createSpyObj<TracklistSelectionService>('TracklistSelectionService', [
            'get',
            'set',
        ]);
        selections.get.and.returnValue(null);
        dialogs = jasmine.createSpyObj<DialogService>('DialogService', ['open']);
        tracklists = jasmine.createSpyObj<TracklistService>('TracklistService', ['getTracklist']);
        associations = jasmine.createSpyObj<TracklistTagAssociationService>(
            'TracklistTagAssociationService',
            ['addTagsToTracklist', 'removeTagsFromTracklist'],
        );
        mediaApi = jasmine.createSpyObj<MediaDetailService>('MediaDetailService', ['getMedia']);
        closed = new Subject();
        ref = jasmine.createSpyObj('DynamicDialogRef', ['destroy'], { onClose: closed.asObservable() });
        dialogs.open.and.returnValue(ref);
        TestBed.configureTestingModule({
            providers: [
                MediaDetailStateService,
                { provide: TracklistFormDialogService, useValue: forms },
                { provide: TracklistSelectionService, useValue: selections },
                { provide: DialogService, useValue: dialogs },
                { provide: TracklistService, useValue: tracklists },
                { provide: TracklistTagAssociationService, useValue: associations },
                { provide: MediaDetailService, useValue: mediaApi },
                { provide: MessageService, useValue: jasmine.createSpyObj('MessageService', ['add']) },
            ],
        });
        state = TestBed.inject(MediaDetailStateService);
        component = TestBed.runInInjectionContext(() => new MediaDetailTvSeriesTracklistsTabComponent());
    });

    function load(tracklists = [createSeriesTracklist()], seasons = [createSeriesSeason()]): void {
        const data = createSeriesMedia(tracklists, seasons);
        state.setMedia(data);
        component.mediaData = data;
    }
    function renderUpdatedInput(): void {
        component.mediaData = state.mediaData()!;
    }

    it('sorts seasons and episodes and groups tracklists using the real season ID', () => {
        // Arrange
        const second = createSeriesSeason({ id: 21, seasonNumber: 1 });
        const secondTracklist = createSeriesTracklist(
            { id: 43 },
            { season: { id: 21, seasonNumber: 1, createdAt: '2026-10-01 19:00:00', updatedAt: null } },
        );
        load([secondTracklist, createSeriesTracklist()], [second, createSeriesSeason()]);

        // Act
        const panels = component.panels();

        // Assert
        expect(panels.map((panel) => panel.season.seasonNumber)).toEqual([0, 1]);
        expect(panels[0].tracklist?.id).toBe(42);
        expect(panels[1].tracklist?.id).toBe(43);
        expect(panels[0].episodes.map((row) => row.episode.episodeNumber)).toEqual([1, 2, 3]);
    });

    it('restores a stored selection only when it belongs to that season', () => {
        // Arrange
        selections.get.and.returnValues(43, 999);
        load([createSeriesTracklist(), createSeriesTracklist({ id: 43 })]);
        const otherTracklist = createSeriesTracklist(
            { id: 44 },
            { season: { id: 30, seasonNumber: 1, createdAt: '2026-10-01 19:00:00', updatedAt: null } },
        );

        // Act
        const restored = component.panels()[0].tracklist?.id;
        component.mediaData = createSeriesMedia([otherTracklist], [createSeriesSeason({ id: 30 })]);

        // Assert
        expect(restored).toBe(43);
        expect(component.panels()[0].tracklist?.id).toBe(44);
    });

    it('keeps per-season selections when switching accordion panels', () => {
        // Arrange
        load(
            [createSeriesTracklist(), createSeriesTracklist({ id: 43 })],
            [createSeriesSeason(), createSeriesSeason({ id: 21, seasonNumber: 1 })],
        );

        // Act
        component.onSeasonChange(20);
        component.selectTracklist(20, 43);
        component.onSeasonChange(21);
        component.onSeasonChange(20);

        // Assert
        expect(component.activeSeasonId()).toBe(20);
        expect(component.panels()[0].tracklist?.id).toBe(43);
        expect(selections.set).toHaveBeenCalledWith(11, 20, 43);
        expect(mediaApi.getMedia).not.toHaveBeenCalled();
    });

    it('creates a season tracklist through the new dialog and selects it without collapsing', () => {
        // Arrange
        load();
        component.onSeasonChange(20);
        const saved = createSeriesTracklist({ id: 43, tracklistName: 'New viewing' });
        forms.open.and.returnValue(of({ action: 'saved', tracklist: saved }));

        // Act
        component.createTracklist(20);
        renderUpdatedInput();

        // Assert
        expect(forms.open).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({
                mode: 'create',
                mediaType: 'tv',
                season: jasmine.objectContaining({ id: 20, seasonNumber: 0 }),
            }),
        );
        expect(component.activeSeasonId()).toBe(20);
        expect(component.panels()[0].tracklist?.id).toBe(43);
        expect(state.mediaData()?.tracklists.length).toBe(2);
        expect(mediaApi.getMedia).not.toHaveBeenCalled();
    });

    it('edits a tracklist locally while keeping its panel and selection', () => {
        // Arrange
        const original = createSeriesTracklist();
        load([original]);
        component.onSeasonChange(20);
        const saved = { ...original, tracklistName: 'Updated', comment: null };
        forms.open.and.returnValue(of({ action: 'saved', tracklist: saved }));

        // Act
        component.editTracklist(original);
        renderUpdatedInput();

        // Assert
        expect(forms.open).toHaveBeenCalledOnceWith({ mode: 'edit', tracklist: original });
        expect(component.activeSeasonId()).toBe(20);
        expect(component.panels()[0].tracklist).toBe(saved);
        expect(mediaApi.getMedia).not.toHaveBeenCalled();
    });

    for (const keepAnother of [true, false]) {
        it(`keeps the panel open after deleting its selected tracklist (${keepAnother ? 'fallback selection' : 'empty season'})`, () => {
            // Arrange
            const original = createSeriesTracklist();
            load(keepAnother ? [original, createSeriesTracklist({ id: 43 })] : [original]);
            component.onSeasonChange(20);
            forms.open.and.returnValue(of({ action: 'deleted', tracklistId: 42 }));

            // Act
            component.editTracklist(original);
            renderUpdatedInput();

            // Assert
            expect(component.activeSeasonId()).toBe(20);
            expect(component.panels()[0].tracklist?.id ?? null).toBe(keepAnother ? 43 : null);
            expect(selections.set).toHaveBeenCalledWith(11, 20, keepAnother ? 43 : null);
            expect(mediaApi.getMedia).not.toHaveBeenCalled();
        });
    }

    it('does not change data or selection after cancellation', () => {
        // Arrange
        load();
        const original = state.mediaData();
        forms.open.and.returnValue(of(undefined));

        // Act
        component.createTracklist(20);

        // Assert
        expect(state.mediaData()).toBe(original);
        expect(selections.set).not.toHaveBeenCalled();
    });

    it('shows zero as a valid custom season number', () => {
        // Arrange
        load();

        // Act
        const field = component.panels()[0].details.find((item) => item.label === 'Staffelnummer');

        // Assert
        expect(field?.value).toBe('0');
    });

    it('filters an inclusive episode range and keeps relative and original numbering', () => {
        // Arrange
        load([createSeriesTracklist({}, { startEpisodeNumber: 2, endEpisodeNumber: 3 })]);

        // Act
        const filtered = component.panels()[0].episodes;
        component.toggleEpisodeFilter(20);
        const all = component.panels()[0].episodes;

        // Assert
        expect(filtered.map((row) => row.episode.episodeNumber)).toEqual([2, 3]);
        expect(filtered[0].title).toBe('E01 (E02): Episode 2');
        expect(all.map((row) => row.episode.episodeNumber)).toEqual([1, 2, 3]);
    });

    it('passes the actual tracklist season ID when tracking an episode and updates locally', () => {
        // Arrange
        const tracklist = createSeriesTracklist();
        load([tracklist]);
        component.onSeasonChange(20);
        const sighting = createEpisodeSighting();

        // Act
        component.trackEpisode(tracklist, createSeriesEpisode());
        closed.next({ action: 'saved', episode: sighting });
        renderUpdatedInput();

        // Assert
        expect(dialogs.open).toHaveBeenCalledWith(
            jasmine.any(Function),
            jasmine.objectContaining({
                data: jasmine.objectContaining({ tracklistId: 42, tracklistSeasonId: 50 }),
            }),
        );
        expect(component.panels()[0].episodes[0].sighting).toEqual(sighting);
        expect(component.activeSeasonId()).toBe(20);
        expect(mediaApi.getMedia).not.toHaveBeenCalled();
    });

    it('edits an existing sighting without a date and removes it locally after deletion', () => {
        // Arrange
        const sighting = createEpisodeSighting();
        const tracklist = createSeriesTracklist({}, { tracklistEpisodes: [sighting] });
        load([tracklist]);

        // Act
        component.trackEpisode(tracklist, createSeriesEpisode());
        closed.next({ action: 'deleted', tracklistEpisodeId: 70 });
        renderUpdatedInput();

        // Assert
        expect(dialogs.open).toHaveBeenCalledWith(
            jasmine.any(Function),
            jasmine.objectContaining({ data: jasmine.objectContaining({ sighting }) }),
        );
        expect(component.panels()[0].episodes[0].sighting).toBeUndefined();
        expect(mediaApi.getMedia).not.toHaveBeenCalled();
    });

    it('rejects an episode from another season', () => {
        // Arrange
        const tracklist = createSeriesTracklist();
        load([tracklist]);

        // Act
        component.trackEpisode(tracklist, createSeriesEpisode(999, 1));

        // Assert
        expect(dialogs.open).not.toHaveBeenCalled();
    });

    it('links selected tags and refreshes only that tracklist', () => {
        // Arrange
        const original = createSeriesTracklist({ tags: [tag(1)] });
        load([original]);
        const saved = { ...original, tags: [tag(1), tag(2), tag(3)] };
        associations.addTagsToTracklist.and.returnValue(of(undefined));
        tracklists.getTracklist.and.returnValue(of(saved));

        // Act
        component.linkTags(original);
        closed.next([tag(2), tag(3)]);
        renderUpdatedInput();

        // Assert
        expect(associations.addTagsToTracklist).toHaveBeenCalledOnceWith(42, [2, 3]);
        expect(tracklists.getTracklist).toHaveBeenCalledOnceWith(42);
        expect(component.panels()[0].tracklist?.tags.length).toBe(3);
        expect(mediaApi.getMedia).not.toHaveBeenCalled();
    });

    it('unlinks only the chosen tags', () => {
        // Arrange
        const original = createSeriesTracklist({ tags: [tag(1), tag(2)] });
        load([original]);
        associations.removeTagsFromTracklist.and.returnValue(of(undefined));
        tracklists.getTracklist.and.returnValue(of({ ...original, tags: [tag(1)] }));

        // Act
        component.unlinkTags(original);
        closed.next([tag(2)]);

        // Assert
        expect(associations.removeTagsFromTracklist).toHaveBeenCalledOnceWith(42, [2]);
        expect(state.mediaData()?.tracklists[0].tags).toEqual([tag(1)]);
    });

    it('prefills a new tag with the selected tracklist and updates after creation', () => {
        // Arrange
        const original = createSeriesTracklist();
        load([original]);
        tracklists.getTracklist.and.returnValue(of({ ...original, tags: [tag(2)] }));

        // Act
        component.createTag(original);
        closed.next(tag(2));

        // Assert
        expect(dialogs.open).toHaveBeenCalledWith(
            jasmine.any(Function),
            jasmine.objectContaining({ data: { prefill: { tracklistId: 42 } } }),
        );
        expect(state.mediaData()?.tracklists[0].tags).toEqual([tag(2)]);
        expect(mediaApi.getMedia).not.toHaveBeenCalled();
    });

    it('allows refreshing a tracklist after a failed tag refresh without repeating the mutation', () => {
        // Arrange
        const original = createSeriesTracklist();
        load([original]);
        associations.addTagsToTracklist.and.returnValue(of(undefined));
        tracklists.getTracklist.and.returnValues(
            throwError(() => new Error('Failed')),
            of({ ...original, tags: [tag(2)] }),
        );

        // Act
        component.linkTags(original);
        closed.next([tag(2)]);
        const error = component.tagError();
        component.refreshTracklist(42);

        // Assert
        expect(error).toBeTruthy();
        expect(component.tagBusy()).toBeFalse();
        expect(component.tagError()).toBeNull();
        expect(associations.addTagsToTracklist).toHaveBeenCalledTimes(1);
        expect(tracklists.getTracklist).toHaveBeenCalledTimes(2);
    });

    it('opens the reusable tag table dialog with the selected tracklist tags', () => {
        // Arrange
        const tracklist = createSeriesTracklist({ tags: [tag(1), tag(2)] });

        // Act
        component.openTagTable(tracklist);

        // Assert
        expect(dialogs.open).toHaveBeenCalledWith(
            jasmine.any(Function),
            jasmine.objectContaining({
                data: { tags: tracklist.tags },
                header: 'Tracklisten-Tags',
            }),
        );
    });

    it('isolates image errors to the affected season', () => {
        // Arrange
        load([], [createSeriesSeason(), createSeriesSeason({ id: 21 })]);

        // Act
        component.markPosterError(20);

        // Assert
        expect(component.posterErrors().has(20)).toBeTrue();
        expect(component.posterErrors().has(21)).toBeFalse();
    });

    it('destroys auxiliary dialogs when leaving the tab', () => {
        // Arrange
        load();
        component.trackEpisode(createSeriesTracklist(), createSeriesEpisode());

        // Act
        TestBed.resetTestingModule();

        // Assert
        expect(ref.destroy).toHaveBeenCalledTimes(1);
    });
});
