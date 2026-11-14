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
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { MediaType } from '../../../media/models/enums/media-type.enum';
import { TracklistFormDialogComponent } from '../components/tracklist-form-dialog/tracklist-form-dialog.component';
import { TracklistFormDialogData, TracklistFormDialogResult } from '../models/tracklist-form-dialog-data';
import { TracklistFormDialogService } from './tracklist-form-dialog.service';

describe('TracklistFormDialogService', () => {
    let dialogs: jasmine.SpyObj<DialogService>;
    let ref: jasmine.SpyObj<DynamicDialogRef<unknown>>;
    let closed: Subject<TracklistFormDialogResult | undefined>;
    let service: TracklistFormDialogService;
    const data: TracklistFormDialogData = {
        mode: 'create',
        mediaType: MediaType.MOVIE,
        media: { id: 10, name: 'Movie', firstAirDate: null },
    };

    beforeEach(() => {
        closed = new Subject();
        ref = jasmine.createSpyObj('DynamicDialogRef', ['destroy'], { onClose: closed.asObservable() });
        dialogs = jasmine.createSpyObj<DialogService>('DialogService', ['open']);
        dialogs.open.and.returnValue(ref);
        TestBed.configureTestingModule({
            providers: [TracklistFormDialogService, { provide: DialogService, useValue: dialogs }],
        });
        service = TestBed.inject(TracklistFormDialogService);
    });

    it('opens a modal dialog with the shared mobile breakpoints and typed input', () => {
        // Arrange
        const received = jasmine.createSpy('received');

        // Act
        service.open(data).subscribe(received);
        closed.next(undefined);

        // Assert
        expect(dialogs.open).toHaveBeenCalledOnceWith(
            TracklistFormDialogComponent,
            jasmine.objectContaining({
                data,
                modal: true,
                closable: true,
                dismissableMask: false,
                draggable: false,
                breakpoints: { '1200px': '75vw', '960px': '90vw', '640px': '96vw' },
            }),
        );
        expect(received).toHaveBeenCalledOnceWith(undefined);
    });

    it('returns one result and completes when the dialog closes', () => {
        // Arrange
        const result: TracklistFormDialogResult = { action: 'deleted', tracklistId: 42 };
        const received = jasmine.createSpy('received');
        const complete = jasmine.createSpy('complete');

        // Act
        service.open(data).subscribe({ next: received, complete });
        closed.next(result);
        closed.next(undefined);

        // Assert
        expect(received).toHaveBeenCalledOnceWith(result);
        expect(complete).toHaveBeenCalledTimes(1);
    });

    it('destroys an open dialog when its calling component is destroyed', () => {
        // Arrange
        service.open(data).subscribe();

        // Act
        TestBed.resetTestingModule();

        // Assert
        expect(ref.destroy).toHaveBeenCalledTimes(1);
    });

    it('does not destroy a dialog again after it has already closed', () => {
        // Arrange
        service.open(data).subscribe();
        closed.next(undefined);

        // Act
        TestBed.resetTestingModule();

        // Assert
        expect(ref.destroy).not.toHaveBeenCalled();
    });
});
