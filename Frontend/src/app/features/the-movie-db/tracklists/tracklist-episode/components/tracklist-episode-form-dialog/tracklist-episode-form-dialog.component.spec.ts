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
import { createEpisodeSighting, createSeriesEpisode } from '../../../../media/testing/media-detail.fixtures';
import { TracklistEpisodeDetailDataDto } from '../../../tracklist/models/response/tracklist-season/tracklist-episode/tracklist-episode-detail-data.dto';
import { TracklistEpisodeDialogData } from '../../models/tracklist-episode-dialog-data';
import { TracklistEpisodeService } from '../../services/tracklist-episode.service';
import { TracklistEpisodeFormDialogComponent } from './tracklist-episode-form-dialog.component';

describe('TracklistEpisodeFormDialogComponent', () => {
    let api: jasmine.SpyObj<TracklistEpisodeService>;
    let ref: jasmine.SpyObj<DynamicDialogRef>;
    let confirmation: jasmine.SpyObj<ConfirmationService>;
    let config: DynamicDialogConfig<TracklistEpisodeDialogData>;

    beforeEach(() => {
        api = jasmine.createSpyObj<TracklistEpisodeService>('TracklistEpisodeService', [
            'createTracklistEpisode',
            'updateTracklistEpisode',
            'deleteTracklistEpisode',
        ]);
        api.createTracklistEpisode.and.returnValue(of(createEpisodeSighting()));
        api.updateTracklistEpisode.and.returnValue(of(createEpisodeSighting()));
        api.deleteTracklistEpisode.and.returnValue(of(undefined));
        ref = jasmine.createSpyObj('DynamicDialogRef', ['close']);
        confirmation = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    });

    function create(edit = false): TracklistEpisodeFormDialogComponent {
        config = {
            closable: true,
            closeOnEscape: true,
            data: {
                tracklistId: 42,
                tracklistSeasonId: 50,
                tracklistName: 'My series',
                episode: createSeriesEpisode(),
                sighting: edit ? createEpisodeSighting() : undefined,
            },
        };
        TestBed.configureTestingModule({
            providers: [
                { provide: TracklistEpisodeService, useValue: api },
                { provide: DynamicDialogConfig, useValue: config },
                { provide: DynamicDialogRef, useValue: ref },
                { provide: ConfirmationService, useValue: confirmation },
                { provide: MessageService, useValue: jasmine.createSpyObj('MessageService', ['add']) },
                { provide: ChangeDetectorRef, useValue: { markForCheck: () => {} } },
            ],
        });
        return TestBed.runInInjectionContext(() => new TracklistEpisodeFormDialogComponent());
    }

    it('allows a new sighting with no known watch date', () => {
        // Arrange
        const component = create();
        component.form.controls.watchDateTime.setValue(null);

        // Act
        component.save();

        // Assert
        expect(api.createTracklistEpisode).toHaveBeenCalledOnceWith({
            tracklist_id: 42,
            tracklist_season_id: 50,
            episode_id: 60,
            watch_date_time: null,
        });
        expect(ref.close).toHaveBeenCalledOnceWith({ action: 'saved', episode: createEpisodeSighting() });
    });

    it('preserves an unknown watch date when editing instead of replacing it with now', () => {
        // Arrange
        const component = create(true);

        // Act
        const initial = component.form.getRawValue();

        // Assert
        expect(initial.watchDateTime).toBeNull();
    });

    it('updates by sighting ID and serializes local time without a UTC shift', () => {
        // Arrange
        const component = create(true);
        component.form.controls.watchDateTime.setValue(new Date(2026, 9, 28, 23, 45, 12));

        // Act
        component.save();

        // Assert
        expect(api.updateTracklistEpisode).toHaveBeenCalledOnceWith(70, {
            watch_date_time: '2026-10-28 23:45:12',
        });
        expect(api.createTracklistEpisode).not.toHaveBeenCalled();
    });

    it('blocks an invalid date', () => {
        // Arrange
        const component = create();
        component.form.controls.watchDateTime.setValue(new Date(NaN));

        // Act
        component.save();

        // Assert
        expect(api.createTracklistEpisode).not.toHaveBeenCalled();
        expect(component.form.invalid).toBeTrue();
        expect(ref.close).not.toHaveBeenCalled();
    });

    it('blocks duplicate requests and closing while saving', () => {
        // Arrange
        const pending = new Subject<TracklistEpisodeDetailDataDto>();
        api.createTracklistEpisode.and.returnValue(pending);
        const component = create();

        // Act
        component.save();
        component.save();
        component.cancel();

        // Assert
        expect(api.createTracklistEpisode).toHaveBeenCalledTimes(1);
        expect(config.closable).toBeFalse();
        expect(config.closeOnEscape).toBeFalse();
        expect(component.form.disabled).toBeTrue();
        expect(ref.close).not.toHaveBeenCalled();
    });

    it('deletes only after confirmation and returns the sighting ID', () => {
        // Arrange
        const component = create(true);

        // Act
        component.confirmDelete();
        const callsBeforeConfirmation = api.deleteTracklistEpisode.calls.count();
        confirmation.confirm.calls.mostRecent().args[0].accept?.();

        // Assert
        expect(callsBeforeConfirmation).toBe(0);
        expect(api.deleteTracklistEpisode).toHaveBeenCalledOnceWith(70);
        expect(ref.close).toHaveBeenCalledOnceWith({ action: 'deleted', tracklistEpisodeId: 70 });
    });

    it('retains the input and permits an immediate retry after an error', () => {
        // Arrange
        api.updateTracklistEpisode.and.returnValues(
            throwError(() => new HttpErrorResponse({ status: 500 })),
            of(createEpisodeSighting()),
        );
        const component = create(true);
        const date = new Date(2026, 9, 28, 20);
        component.form.controls.watchDateTime.setValue(date);

        // Act
        component.save();
        const afterError = component.error();
        const dateAfterError = component.form.controls.watchDateTime.value;
        component.save();

        // Assert
        expect(afterError).toBeTruthy();
        expect(dateAfterError).toEqual(date);
        expect(config.closable).toBeTrue();
        expect(api.updateTracklistEpisode).toHaveBeenCalledTimes(2);
        expect(ref.close).toHaveBeenCalledTimes(1);
    });

    it('cancels without saving or deleting', () => {
        // Arrange
        const component = create();

        // Act
        component.cancel();

        // Assert
        expect(ref.close).toHaveBeenCalledTimes(1);
        expect(api.createTracklistEpisode).not.toHaveBeenCalled();
        expect(api.deleteTracklistEpisode).not.toHaveBeenCalled();
    });
});
