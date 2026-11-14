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
import { ChangeDetectorRef, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { finalize, Observable } from 'rxjs';
import isoLangs from '@cospired/i18n-iso-languages';
import localeDe from '@cospired/i18n-iso-languages/langs/de.json';
import { MediaType } from '../../../../media/models/enums/media-type.enum';
import { TRACKLIST_STATUS_LABELS_DE } from '../../models/constants/tracklist-status.constants';
import { TracklistStatusEnum } from '../../models/enums/tracklist-status.enum';
import { TracklistFormDialogData, TracklistFormDialogResult } from '../../models/tracklist-form-dialog-data';
import { TracklistFormValue } from '../../models/tracklist-form-value';
import { TracklistService } from '../../services/tracklist.service';
import {
    getTracklistFormValue,
    optionalDate,
    optionalInteger,
    parseTracklistDate,
    toTracklistRequest,
    tracklistRanges,
} from '../../utils/tracklist-form.utils';

@Component({
    selector: 'app-tracklist-form-dialog',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        Checkbox,
        ConfirmDialog,
        DatePickerModule,
        FloatLabelModule,
        InputTextModule,
        Message,
        RatingModule,
        SelectModule,
        TextareaModule,
    ],
    providers: [ConfirmationService],
    templateUrl: './tracklist-form-dialog.component.html',
    styleUrl: './tracklist-form-dialog.component.css',
})
export class TracklistFormDialogComponent {
    private readonly fb = inject(FormBuilder);
    private readonly tracklists = inject(TracklistService);
    private readonly dialogRef = inject(DynamicDialogRef);
    private readonly config = inject<DynamicDialogConfig<TracklistFormDialogData>>(DynamicDialogConfig);
    private readonly confirmation = inject(ConfirmationService);
    private readonly messages = inject(MessageService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly changeDetector = inject(ChangeDetectorRef);
    private readonly initialCloseOptions = {
        closable: this.config.closable,
        closeOnEscape: this.config.closeOnEscape,
    };

    readonly data = this.requireData();
    readonly isEditing = this.data.mode === 'edit';
    readonly isMovie =
        (this.data.mode === 'edit' ? this.data.tracklist.media.type : this.data.mediaType) ===
        MediaType.MOVIE;
    private readonly initial = getTracklistFormValue(this.data);
    readonly pendingAction = signal<'save' | 'delete' | null>(null);
    readonly isBusy = computed(() => this.pendingAction() !== null);
    readonly submitted = signal(false);
    readonly errorMessage = signal<string | null>(null);
    readonly statusOptions = [
        TracklistStatusEnum.WATCHING,
        TracklistStatusEnum.COMPLETED,
        TracklistStatusEnum.PLAN_TO_WATCH,
        TracklistStatusEnum.DROPPED,
        TracklistStatusEnum.PAUSING,
        TracklistStatusEnum.SKIPPING,
    ].map((value) => ({ label: TRACKLIST_STATUS_LABELS_DE[value], value }));
    readonly languageOptions = this.getLanguageOptions();

    readonly form = this.fb.group(
        {
            tracklistName: this.fb.nonNullable.control(this.initial.tracklistName, [
                Validators.required,
                Validators.pattern(/\S/),
                Validators.maxLength(255),
            ]),
            status: this.fb.nonNullable.control(this.initial.status, Validators.required),
            rating: this.fb.control(this.initial.rating, [optionalInteger(1), Validators.max(10)]),
            isRewatching: this.fb.nonNullable.control(this.initial.isRewatching),
            startDate: this.fb.control(this.initial.startDate, optionalDate),
            finishDate: this.fb.control(this.initial.finishDate, optionalDate),
            comment: this.fb.control(this.initial.comment),
            customAirDate: this.fb.control(this.initial.customAirDate, optionalDate),
            language: this.fb.control(this.initial.language),
            subtitle: this.fb.control(this.initial.subtitle),
            customPosterPath: this.fb.control(this.initial.customPosterPath, Validators.maxLength(255)),
            startEpisodeNumber: this.fb.control(this.initial.startEpisodeNumber, optionalInteger(1)),
            endEpisodeNumber: this.fb.control(this.initial.endEpisodeNumber, optionalInteger(1)),
            customSeasonNumber: this.fb.control(this.initial.customSeasonNumber, optionalInteger(0)),
            customPartNumber: this.fb.control(this.initial.customPartNumber, optionalInteger(1)),
        },
        { validators: tracklistRanges },
    );

    constructor() {
        this.form.controls.isRewatching.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((rewatching) => {
                const control = this.form.controls.tracklistName;
                const suffix = ' Rewatch';
                if (!control.value.trim()) return;
                if (rewatching && !control.value.endsWith(suffix))
                    control.setValue(control.value.trimEnd() + suffix);
                if (!rewatching && control.value.endsWith(suffix))
                    control.setValue(control.value.slice(0, -suffix.length));
            });
        this.form.controls.status.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((status) => {
                if (
                    this.form.controls.finishDate.value ||
                    this.data.mode !== 'edit' ||
                    (status !== TracklistStatusEnum.COMPLETED && status !== TracklistStatusEnum.DROPPED)
                )
                    return;
                const dates =
                    this.data.tracklist.tracklistSeason?.tracklistEpisodes
                        .map((episode) => parseTracklistDate(episode.watchDateTime))
                        .filter((date): date is Date => date !== null) ?? [];
                if (dates.length)
                    this.form.controls.finishDate.setValue(
                        new Date(Math.max(...dates.map((date) => date.getTime()))),
                    );
            });
    }

    save(): void {
        if (this.isBusy()) return;
        this.submitted.set(true);
        this.form.markAllAsTouched();
        if (this.form.invalid) return;
        this.errorMessage.set(null);
        const request = toTracklistRequest(this.form.getRawValue(), this.isMovie);
        const data = this.data;
        const operation =
            data.mode === 'edit'
                ? this.tracklists.updateTracklist(data.tracklist.id, request)
                : this.tracklists.createTracklist(
                      data.mediaType === MediaType.MOVIE
                          ? { ...request, media_id: data.media.id, media_type: MediaType.MOVIE }
                          : {
                                ...request,
                                media_id: data.media.id,
                                media_type: MediaType.TV_SHOW,
                                season_id: data.season.id,
                            },
                  );

        this.execute(operation, 'save', (tracklist) => {
            this.messages.add({
                severity: 'success',
                summary: 'Erfolg',
                detail: this.isEditing
                    ? 'Trackliste erfolgreich gespeichert.'
                    : 'Trackliste erfolgreich angelegt.',
            });
            this.close({ action: 'saved', tracklist });
        });
    }

    confirmDelete(): void {
        if (this.isBusy() || this.data.mode !== 'edit') return;
        this.confirmation.confirm({
            key: 'tracklist-delete',
            header: 'Trackliste löschen',
            message: 'Willst du diese Trackliste wirklich löschen?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Löschen',
            rejectLabel: 'Abbrechen',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
            defaultFocus: 'reject',
            accept: () => this.deleteTracklist(),
        });
    }

    cancel(): void {
        if (!this.isBusy()) this.close();
    }

    hasError(field: keyof TracklistFormValue): boolean {
        const control = this.form.controls[field];
        return control.invalid && (control.touched || control.dirty || this.submitted());
    }

    dateBoundary(field: 'startDate' | 'finishDate'): Date | undefined {
        const control = this.form.controls[field];
        return control.valid && control.value instanceof Date ? control.value : undefined;
    }

    private deleteTracklist(): void {
        if (this.isBusy() || this.data.mode !== 'edit') return;
        const tracklistId = this.data.tracklist.id;
        this.execute(this.tracklists.deleteTracklist(tracklistId), 'delete', () => {
            this.messages.add({
                severity: 'success',
                summary: 'Erfolg',
                detail: 'Trackliste erfolgreich gelöscht.',
            });
            this.close({ action: 'deleted', tracklistId });
        });
    }

    private execute<T>(
        request: Observable<T>,
        action: 'save' | 'delete',
        success: (result: T) => void,
    ): void {
        this.errorMessage.set(null);
        this.setPending(action);
        request
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.setPending(null)),
            )
            .subscribe({
                next: success,
                error: (error: unknown) => {
                    this.errorMessage.set(
                        error instanceof HttpErrorResponse && error.status === 401
                            ? 'Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.'
                            : action === 'delete'
                              ? 'Die Trackliste konnte nicht gelöscht werden. Bitte versuche es erneut.'
                              : 'Die Trackliste konnte nicht gespeichert werden. Bitte prüfe deine Angaben und versuche es erneut.',
                    );
                },
            });
    }

    private setPending(action: 'save' | 'delete' | null): void {
        this.pendingAction.set(action);
        if (action) this.form.disable({ emitEvent: false });
        else this.form.enable({ emitEvent: false });
        this.config.closable = action ? false : this.initialCloseOptions.closable;
        this.config.closeOnEscape = action ? false : this.initialCloseOptions.closeOnEscape;
        this.changeDetector.markForCheck();
    }

    private close(result?: TracklistFormDialogResult): void {
        this.dialogRef.close(result);
    }

    private requireData(): TracklistFormDialogData {
        if (!this.config.data) throw new Error('TracklistFormDialogComponent requires dialog data.');
        return this.config.data;
    }

    private getLanguageOptions() {
        isoLangs.registerLocale(localeDe);
        const names = isoLangs.getNames('de');
        const frequent = ['de', 'en', 'ja', 'ko'];
        const option = (code: string) => ({ name: names[code], code });
        return [
            { groupName: 'Häufig genutzt', items: frequent.map(option) },
            {
                groupName: 'Alphabetisch',
                items: Object.keys(names)
                    .filter((code) => !frequent.includes(code))
                    .map(option)
                    .sort((a, b) => a.name.localeCompare(b.name, 'de')),
            },
        ];
    }
}
