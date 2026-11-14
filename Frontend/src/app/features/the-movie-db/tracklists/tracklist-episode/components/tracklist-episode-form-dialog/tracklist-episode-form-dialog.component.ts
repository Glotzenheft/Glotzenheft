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

import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DatePicker } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { Image } from 'primeng/image';
import { Message } from 'primeng/message';
import { finalize, Observable } from 'rxjs';
import { TMDB_ORIGINAL_IMAGE_PATH, TMDB_POSTER_PATH } from '../../../../../../shared/variables/tmdb-vars';
import {
    formatTracklistDate,
    optionalDate,
    parseTracklistDate,
} from '../../../tracklist/utils/tracklist-form.utils';
import {
    TracklistEpisodeDialogData,
    TracklistEpisodeDialogResult,
} from '../../models/tracklist-episode-dialog-data';
import { TracklistEpisodeService } from '../../services/tracklist-episode.service';

@Component({
    selector: 'app-tracklist-episode-form-dialog',
    standalone: true,
    imports: [Button, ConfirmDialog, DatePipe, DatePicker, FloatLabel, Image, Message, ReactiveFormsModule],
    providers: [ConfirmationService],
    templateUrl: './tracklist-episode-form-dialog.component.html',
    styleUrl: './tracklist-episode-form-dialog.component.css',
})
export class TracklistEpisodeFormDialogComponent {
    private readonly api = inject(TracklistEpisodeService);
    private readonly ref = inject(DynamicDialogRef);
    private readonly config = inject<DynamicDialogConfig<TracklistEpisodeDialogData>>(DynamicDialogConfig);
    private readonly destroyRef = inject(DestroyRef);
    private readonly changes = inject(ChangeDetectorRef);
    private readonly confirmation = inject(ConfirmationService);
    private readonly messages = inject(MessageService);
    private readonly initialClose = {
        closable: this.config.closable,
        closeOnEscape: this.config.closeOnEscape,
    };
    readonly data = this.getData();
    readonly parseDate = parseTracklistDate;
    readonly imageError = signal(false);
    readonly error = signal<string | null>(null);
    readonly pending = signal<'save' | 'delete' | null>(null);
    readonly poster =
        TMDB_POSTER_PATH.replace(/\/+$/, '') + '/' + (this.data.episode.stillPath ?? '').replace(/^\/+/, '');
    readonly originalPoster =
        TMDB_ORIGINAL_IMAGE_PATH.replace(/\/+$/, '') +
        '/' +
        (this.data.episode.stillPath ?? '').replace(/^\/+/, '');
    readonly form = new FormGroup({
        watchDateTime: new FormControl<Date | null>(
            this.data.sighting ? parseTracklistDate(this.data.sighting.watchDateTime) : new Date(),
            optionalDate,
        ),
    });

    save(): void {
        if (this.pending()) return;
        this.form.markAllAsTouched();
        if (this.form.invalid) return;
        const watch_date_time = formatTracklistDate(this.form.getRawValue().watchDateTime, true);
        const request = this.data.sighting
            ? this.api.updateTracklistEpisode(this.data.sighting.id, { watch_date_time })
            : this.api.createTracklistEpisode({
                  tracklist_id: this.data.tracklistId,
                  tracklist_season_id: this.data.tracklistSeasonId,
                  episode_id: this.data.episode.id,
                  watch_date_time,
              });
        this.execute(request, 'save', (episode) => {
            this.messages.add({
                severity: 'success',
                summary: 'Erfolg',
                detail: 'Episode erfolgreich gespeichert.',
            });
            this.close({ action: 'saved', episode });
        });
    }

    confirmDelete(): void {
        if (this.pending() || !this.data.sighting) return;
        this.confirmation.confirm({
            key: 'episode-delete',
            header: 'Episode löschen',
            message: 'Willst du die Episode wirklich aus dieser Trackliste löschen?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Löschen',
            rejectLabel: 'Abbrechen',
            defaultFocus: 'reject',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            accept: () => {
                if (this.pending() || !this.data.sighting) return;
                const id = this.data.sighting.id;
                this.execute(this.api.deleteTracklistEpisode(id), 'delete', () => {
                    this.messages.add({
                        severity: 'success',
                        summary: 'Erfolg',
                        detail: 'Episode erfolgreich gelöscht.',
                    });
                    this.close({ action: 'deleted', tracklistEpisodeId: id });
                });
            },
        });
    }

    cancel(): void {
        if (!this.pending()) this.ref.close();
    }

    private execute<T>(request: Observable<T>, action: 'save' | 'delete', next: (value: T) => void): void {
        this.error.set(null);
        this.setPending(action);
        request
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.setPending(null)),
            )
            .subscribe({
                next,
                error: (error: unknown) =>
                    this.error.set(
                        error instanceof HttpErrorResponse && error.status === 401
                            ? 'Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.'
                            : 'Die Änderung konnte nicht gespeichert werden. Bitte versuche es erneut.',
                    ),
            });
    }

    private setPending(action: 'save' | 'delete' | null): void {
        this.pending.set(action);
        if (action) this.form.disable({ emitEvent: false });
        else this.form.enable({ emitEvent: false });
        this.config.closable = action ? false : this.initialClose.closable;
        this.config.closeOnEscape = action ? false : this.initialClose.closeOnEscape;
        this.changes.markForCheck();
    }

    private close(result: TracklistEpisodeDialogResult): void {
        this.ref.close(result);
    }

    private getData(): TracklistEpisodeDialogData {
        if (!this.config.data) throw new Error('TracklistEpisodeFormDialogComponent requires dialog data.');
        return this.config.data;
    }
}
