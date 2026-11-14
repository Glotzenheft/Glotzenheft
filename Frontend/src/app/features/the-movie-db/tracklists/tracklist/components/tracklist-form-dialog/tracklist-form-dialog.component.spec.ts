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

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of, Subject, throwError } from 'rxjs';
import { MediaType } from '../../../../media/models/enums/media-type.enum';
import { TracklistStatusEnum } from '../../models/enums/tracklist-status.enum';
import { TracklistFormDialogData } from '../../models/tracklist-form-dialog-data';
import { TracklistFormValue } from '../../models/tracklist-form-value';
import { TracklistResponseDto } from '../../models/response/tracklist-response.dto';
import { TracklistService } from '../../services/tracklist.service';
import {
    formatTracklistDate,
    getTracklistFormValue,
    parseTracklistDate,
} from '../../utils/tracklist-form.utils';
import { TracklistFormDialogComponent } from './tracklist-form-dialog.component';

describe('TracklistFormDialogComponent', () => {
    let api: jasmine.SpyObj<TracklistService>;
    let ref: jasmine.SpyObj<DynamicDialogRef>;
    let confirmation: jasmine.SpyObj<ConfirmationService>;
    let config: DynamicDialogConfig<TracklistFormDialogData>;

    const movie: TracklistFormDialogData = {
        mode: 'create',
        mediaType: MediaType.MOVIE,
        media: { id: 10, name: 'Movie', firstAirDate: '2024-06-15' },
    };
    const series: TracklistFormDialogData = {
        mode: 'create',
        mediaType: MediaType.TV_SHOW,
        media: { id: 11, name: 'Series', firstAirDate: null },
        season: { id: 20, seasonNumber: 0, airDate: '2026-10-01', episodes: [] },
    };
    const response: TracklistResponseDto = {
        id: 42,
        tracklistName: 'My series',
        status: TracklistStatusEnum.WATCHING,
        rating: null,
        isRewatching: false,
        startDate: '2026-10-01 20:15:12',
        finishDate: null,
        comment: 'Keep this note',
        customAirDate: null,
        language: 'ja',
        subtitle: 'de',
        customPosterPath: '/existing-poster.jpg',
        createdAt: '2026-10-01 20:15:12',
        updatedAt: null,
        tags: [],
        media: {
            id: 11,
            type: MediaType.TV_SHOW,
            posterPath: null,
            createdAt: '2026-10-01 19:00:00',
            updatedAt: null,
        },
        tracklistSeason: {
            id: 50,
            createdAt: '2026-10-01 20:15:12',
            updatedAt: null,
            startEpisodeNumber: null,
            endEpisodeNumber: null,
            customSeasonNumber: 0,
            customPartNumber: null,
            season: { id: 20, seasonNumber: 0, createdAt: '2026-10-01 19:00:00', updatedAt: null },
            tracklistEpisodes: [
                {
                    id: 70,
                    createdAt: '2026-10-01 20:15:12',
                    updatedAt: null,
                    watchDateTime: '2026-10-28 23:45:12',
                    episode: { id: 60, episodeNumber: 1, createdAt: '2026-10-01 19:00:00', updatedAt: null },
                },
                {
                    id: 71,
                    createdAt: '2026-10-01 20:15:12',
                    updatedAt: null,
                    watchDateTime: '2026-10-27 20:00:00',
                    episode: { id: 61, episodeNumber: 2, createdAt: '2026-10-01 19:00:00', updatedAt: null },
                },
                {
                    id: 72,
                    createdAt: '2026-10-01 20:15:12',
                    updatedAt: null,
                    watchDateTime: null,
                    episode: { id: 62, episodeNumber: 3, createdAt: '2026-10-01 19:00:00', updatedAt: null },
                },
            ],
        },
    };

    beforeEach(() => {
        api = jasmine.createSpyObj<TracklistService>('TracklistService', [
            'createTracklist',
            'updateTracklist',
            'deleteTracklist',
        ]);
        api.createTracklist.and.returnValue(of(response));
        api.updateTracklist.and.returnValue(of(response));
        api.deleteTracklist.and.returnValue(of(undefined));
        ref = jasmine.createSpyObj<DynamicDialogRef>('DynamicDialogRef', ['close']);
        confirmation = jasmine.createSpyObj<ConfirmationService>('ConfirmationService', ['confirm']);
    });

    function createDialog(data: TracklistFormDialogData): TracklistFormDialogComponent {
        config = { data, closable: true, closeOnEscape: true };
        TestBed.configureTestingModule({
            providers: [
                { provide: TracklistService, useValue: api },
                { provide: DynamicDialogConfig, useValue: config },
                { provide: DynamicDialogRef, useValue: ref },
                { provide: ConfirmationService, useValue: confirmation },
                { provide: MessageService, useValue: jasmine.createSpyObj('MessageService', ['add']) },
                { provide: ChangeDetectorRef, useValue: { markForCheck: () => {} } },
            ],
        });
        return TestBed.runInInjectionContext(() => new TracklistFormDialogComponent());
    }

    it('prefills a new movie with its title, air date and watching status', () => {
        // Arrange
        const now = new Date(2026, 9, 28, 20, 15, 12);

        // Act
        const value = getTracklistFormValue(movie, now);

        // Assert
        expect(value.tracklistName).toBe('Movie');
        expect(value.status).toBe(TracklistStatusEnum.WATCHING);
        expect(value.startDate).toEqual(now);
        expect(value.startDate).not.toBe(now);
        expect(value.customAirDate).toEqual(new Date(2024, 5, 15));
        expect(value.customSeasonNumber).toBeNull();
    });

    it('prefills specials as season zero with an initial episode number of one', () => {
        // Arrange
        const component = createDialog(series);

        // Act
        const value = component.form.getRawValue();

        // Assert
        expect(value.tracklistName).toBe('Series - Staffel 0');
        expect(value.customSeasonNumber).toBe(0);
        expect(value.startEpisodeNumber).toBe(1);
        expect(value.customAirDate).toEqual(new Date(2026, 9, 1));
        expect(component.isMovie).toBeFalse();
    });

    it('uses the first numbered episode as the air-date fallback without reordering the source', () => {
        // Arrange
        const episode = {
            id: 60,
            tmdbEpisodeId: 600,
            name: 'Episode',
            overview: '',
            runtime: null,
            stillPath: null,
            createdAt: '2026-10-01 19:00:00',
            updatedAt: null,
        };
        const episodes = [
            { ...episode, episodeNumber: 2, airDate: '2026-10-02' },
            { ...episode, id: 61, episodeNumber: 1, airDate: '2026-10-01' },
        ];
        const data: TracklistFormDialogData = {
            mode: 'create',
            mediaType: MediaType.TV_SHOW,
            media: { id: 11, name: 'Series', firstAirDate: null },
            season: { id: 20, seasonNumber: 1, airDate: null, episodes },
        };

        // Act
        const value = getTracklistFormValue(data);

        // Assert
        expect(value.customAirDate).toEqual(new Date(2026, 9, 1));
        expect(episodes.map((item) => item.episodeNumber)).toEqual([2, 1]);
    });

    it('preserves optional null values, specials and the existing hidden poster when editing', () => {
        // Arrange
        const component = createDialog({ mode: 'edit', tracklist: response });

        // Act
        const value = component.form.getRawValue();

        // Assert
        expect(value.startDate).toEqual(new Date(2026, 9, 1, 20, 15, 12));
        expect(value.finishDate).toBeNull();
        expect(value.customAirDate).toBeNull();
        expect(value.startEpisodeNumber).toBeNull();
        expect(value.customSeasonNumber).toBe(0);
        expect(value.customPosterPath).toBe('/existing-poster.jpg');
    });

    it('adds the Rewatch suffix once and removes it when switched off', () => {
        // Arrange
        const component = createDialog({ mode: 'edit', tracklist: response });

        // Act
        component.form.controls.isRewatching.setValue(true);
        component.form.controls.isRewatching.setValue(true);
        const rewatchName = component.form.controls.tracklistName.value;
        component.form.controls.isRewatching.setValue(false);

        // Assert
        expect(rewatchName).toBe('My series Rewatch');
        expect(component.form.controls.tracklistName.value).toBe('My series');
        expect(response.tracklistName).toBe('My series');
    });

    for (const status of [TracklistStatusEnum.COMPLETED, TracklistStatusEnum.DROPPED]) {
        it(`prefills the finish date from the latest sighting when status becomes ${status}`, () => {
            // Arrange
            const component = createDialog({ mode: 'edit', tracklist: response });

            // Act
            component.form.controls.status.setValue(status);

            // Assert
            expect(component.form.controls.finishDate.value).toEqual(new Date(2026, 9, 28, 23, 45, 12));
        });
    }

    it('preserves a manually entered finish date on status changes', () => {
        // Arrange
        const component = createDialog({ mode: 'edit', tracklist: response });
        const finish = new Date(2026, 9, 29, 19);
        component.form.controls.finishDate.setValue(finish);

        // Act
        component.form.controls.status.setValue(TracklistStatusEnum.COMPLETED);

        // Assert
        expect(component.form.controls.finishDate.value).toEqual(finish);
    });

    const invalidCases: { label: string; value: Partial<TracklistFormValue> }[] = [
        { label: 'blank names', value: { tracklistName: '   ' } },
        { label: 'names exceeding 255 characters', value: { tracklistName: 'x'.repeat(256) } },
        {
            label: 'reversed dates',
            value: { startDate: new Date(2026, 9, 29), finishDate: new Date(2026, 9, 28) },
        },
        { label: 'invalid dates', value: { startDate: new Date(NaN) } },
        { label: 'reversed episode ranges', value: { startEpisodeNumber: 4, endEpisodeNumber: 2 } },
        { label: 'fractional season numbers', value: { customSeasonNumber: 1.5 } },
        { label: 'negative season numbers', value: { customSeasonNumber: -1 } },
        { label: 'part zero', value: { customPartNumber: 0 } },
        { label: 'ratings exceeding ten', value: { rating: 11 } },
    ];
    for (const { label, value } of invalidCases) {
        it(`blocks saving ${label}`, () => {
            // Arrange
            const component = createDialog(series);
            component.form.patchValue(value);

            // Act
            component.save();

            // Assert
            expect(component.form.invalid).toBeTrue();
            expect(api.createTracklist).not.toHaveBeenCalled();
            expect(ref.close).not.toHaveBeenCalled();
            expect(component.form.touched).toBeTrue();
        });
    }

    it('creates a movie with local date strings and returns the complete server result', () => {
        // Arrange
        const component = createDialog(movie);
        component.form.patchValue({ startDate: new Date(2026, 9, 28, 23, 45, 12) });

        // Act
        component.save();

        // Assert
        expect(api.createTracklist).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({
                media_id: 10,
                media_type: MediaType.MOVIE,
                tracklist_name: 'Movie',
                tracklist_start_date: '2026-10-28 23:45:12',
                custom_air_date: '2024-06-15',
            }),
        );
        expect(Object.hasOwn(api.createTracklist.calls.mostRecent().args[0], 'season_id')).toBeFalse();
        expect(
            Object.hasOwn(api.createTracklist.calls.mostRecent().args[0], 'custom_season_number'),
        ).toBeFalse();
        expect(ref.close).toHaveBeenCalledOnceWith({ action: 'saved', tracklist: response });
    });

    it('creates a series tracklist with its real season ID and specials number', () => {
        // Arrange
        const component = createDialog(series);

        // Act
        component.save();

        // Assert
        expect(api.createTracklist).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({
                media_id: 11,
                media_type: MediaType.TV_SHOW,
                season_id: 20,
                custom_season_number: 0,
                start_episode_number: 1,
                custom_part_number: null,
            }),
        );
        expect(ref.close).toHaveBeenCalledOnceWith({ action: 'saved', tracklist: response });
    });

    it('updates by ID, clears nullable fields and preserves the custom poster', () => {
        // Arrange
        const component = createDialog({ mode: 'edit', tracklist: response });
        component.form.patchValue({ comment: null, language: null, customSeasonNumber: null });

        // Act
        component.save();

        // Assert
        expect(api.updateTracklist).toHaveBeenCalledOnceWith(
            42,
            jasmine.objectContaining({
                comment: null,
                language: null,
                custom_season_number: null,
                custom_poster_path: '/existing-poster.jpg',
            }),
        );
        expect(ref.close).toHaveBeenCalledOnceWith({ action: 'saved', tracklist: response });
        expect(response.comment).toBe('Keep this note');
    });

    it('prevents duplicate submissions, cancellation and header closing during a write', () => {
        // Arrange
        const pending = new Subject<TracklistResponseDto>();
        api.updateTracklist.and.returnValue(pending);
        const component = createDialog({ mode: 'edit', tracklist: response });

        // Act
        component.save();
        component.save();
        component.cancel();
        component.confirmDelete();

        // Assert
        expect(api.updateTracklist).toHaveBeenCalledTimes(1);
        expect(component.form.disabled).toBeTrue();
        expect(config.closable).toBeFalse();
        expect(config.closeOnEscape).toBeFalse();
        expect(ref.close).not.toHaveBeenCalled();
        expect(confirmation.confirm).not.toHaveBeenCalled();
    });

    it('keeps input after an error, restores closing and allows an immediate retry', () => {
        // Arrange
        api.updateTracklist.and.returnValues(
            throwError(() => new HttpErrorResponse({ status: 422 })),
            of(response),
        );
        const component = createDialog({ mode: 'edit', tracklist: response });
        component.form.controls.comment.setValue('Retry this note');

        // Act
        component.save();
        const error = component.errorMessage();
        const retainedNote = component.form.controls.comment.value;
        const enabledAfterError = component.form.enabled;
        component.save();

        // Assert
        expect(error).toBeTruthy();
        expect(retainedNote).toBe('Retry this note');
        expect(enabledAfterError).toBeTrue();
        expect(config.closable).toBeTrue();
        expect(config.closeOnEscape).toBeTrue();
        expect(api.updateTracklist).toHaveBeenCalledTimes(2);
        expect(ref.close).toHaveBeenCalledOnceWith({ action: 'saved', tracklist: response });
    });

    it('deletes only after confirmation and returns the deleted ID', () => {
        // Arrange
        const component = createDialog({ mode: 'edit', tracklist: response });

        // Act
        component.confirmDelete();
        const deletedBeforeConfirmation = api.deleteTracklist.calls.count();
        confirmation.confirm.calls.mostRecent().args[0].accept?.();

        // Assert
        expect(deletedBeforeConfirmation).toBe(0);
        expect(api.deleteTracklist).toHaveBeenCalledOnceWith(42);
        expect(ref.close).toHaveBeenCalledOnceWith({ action: 'deleted', tracklistId: 42 });
    });

    it('retains the dialog and enables retry if deletion fails', () => {
        // Arrange
        api.deleteTracklist.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
        const component = createDialog({ mode: 'edit', tracklist: response });

        // Act
        component.confirmDelete();
        confirmation.confirm.calls.mostRecent().args[0].accept?.();

        // Assert
        expect(component.isBusy()).toBeFalse();
        expect(component.form.enabled).toBeTrue();
        expect(component.errorMessage()).toContain('nicht gelöscht');
        expect(ref.close).not.toHaveBeenCalled();
    });

    it('cancels without issuing a request and prevents deletion in create mode', () => {
        // Arrange
        const component = createDialog(movie);

        // Act
        component.confirmDelete();
        component.cancel();

        // Assert
        expect(ref.close).toHaveBeenCalledOnceWith(undefined);
        expect(api.createTracklist).not.toHaveBeenCalled();
        expect(api.deleteTracklist).not.toHaveBeenCalled();
        expect(confirmation.confirm).not.toHaveBeenCalled();
    });

    it('round-trips local API datetimes without converting to UTC', () => {
        // Arrange
        const dateTime = '2026-10-28 00:15:12';

        // Act
        const parsed = parseTracklistDate(dateTime);
        const formatted = formatTracklistDate(parsed, true);

        // Assert
        expect(parsed?.getHours()).toBe(0);
        expect(formatted).toBe(dateTime);
        expect(formatTracklistDate(parsed)).toBe('2026-10-28');
    });

    it('rejects impossible dates instead of silently rolling to another month', () => {
        // Arrange
        const impossibleDate = '2026-02-30';

        // Act
        const parsed = parseTracklistDate(impossibleDate);

        // Assert
        expect(parsed).toBeNull();
    });
});
