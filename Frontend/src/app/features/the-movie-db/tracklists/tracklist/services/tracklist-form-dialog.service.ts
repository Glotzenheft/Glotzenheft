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

import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EMPTY, Observable, take } from 'rxjs';
import { TracklistFormDialogComponent } from '../components/tracklist-form-dialog/tracklist-form-dialog.component';
import { TracklistFormDialogData, TracklistFormDialogResult } from '../models/tracklist-form-dialog-data';

/** Provide alongside DialogService on the component that opens the dialogs. */
@Injectable()
export class TracklistFormDialogService {
    private readonly dialogs = inject(DialogService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly openDialogs = new Set<DynamicDialogRef<TracklistFormDialogComponent>>();

    constructor() {
        this.destroyRef.onDestroy(() => {
            for (const dialog of this.openDialogs) dialog.destroy();
            this.openDialogs.clear();
        });
    }

    open(data: TracklistFormDialogData): Observable<TracklistFormDialogResult | undefined> {
        const ref = this.dialogs.open(TracklistFormDialogComponent, {
            header: data.mode === 'edit' ? 'Trackliste bearbeiten' : 'Neue Trackliste anlegen',
            data,
            modal: true,
            closable: true,
            closeOnEscape: true,
            dismissableMask: false,
            focusTrap: true,
            draggable: false,
            resizable: false,
            width: '60vw',
            style: { maxWidth: '64rem', maxHeight: 'calc(100dvh - 1rem)' },
            contentStyle: { overflow: 'auto', minWidth: '0' },
            breakpoints: { '1200px': '75vw', '960px': '90vw', '640px': '96vw' },
            styleClass: 'tracklist-form-dialog',
            closeAriaLabel: 'Dialog schließen',
        });
        // PrimeNG can decline a duplicate dialog even though its return type is non-nullable.
        if (!ref) return EMPTY;
        this.openDialogs.add(ref);
        ref.onClose
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.openDialogs.delete(ref));
        return ref.onClose.pipe(take(1), takeUntilDestroyed(this.destroyRef));
    }
}
