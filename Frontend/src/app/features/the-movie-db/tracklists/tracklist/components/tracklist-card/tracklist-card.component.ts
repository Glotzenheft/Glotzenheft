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

import { FitSingleLineTextDirective } from './fit-single-line-text.directive';
import { DatePipe } from '@angular/common';
import {
    Component,
    DestroyRef,
    EventEmitter,
    inject,
    Input,
    Output,
    OnChanges,
    signal,
    Type,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Image } from 'primeng/image';
import { SplitButton } from 'primeng/splitbutton';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { EMPTY, finalize, Observable, switchMap, take } from 'rxjs';
import { TRACKLIST_TAG_URLS } from '../../../../../../core/constants/urls.constants';
import { TRACKLIST_STATUS_COLORS } from '../../../../../../core/constants/color.constants';
import { LanguageNamePipe } from '../../../../../../shared/pipes/language-name/language-name.pipe';
import { MediaTypePipe } from '../../../../../../shared/pipes/media-type/media-type.pipe';
import { TracklistStatusPipe } from '../../../../../../shared/pipes/tracklist-status/tracklist-status.pipe';
import {
    TMDB_POSTER_PATH,
    TMDB_ORIGINAL_IMAGE_PATH,
} from '../../../../../../shared/variables/tmdb-vars';
import { MediaDetailDataResponseDto } from '../../../../media/models/response/media-detail-data-response.dto';
import { TracklistTagFormDialogComponent } from '../../../../tags-and-groups/tracklist-tag/components/tracklist-tag-form-dialog/tracklist-tag-form-dialog.component';
import { TracklistTagSelectionDialogComponent } from '../../../../tags-and-groups/tracklist-tag/components/tracklist-tag-selection-dialog/tracklist-tag-selection-dialog.component';
import { TracklistTagUnlinkDialogComponent } from '../../../../tags-and-groups/tracklist-tag/components/tracklist-tag-unlink-dialog/tracklist-tag-unlink-dialog.component';
import { TracklistTagTableDialogComponent } from '../../../../tags-and-groups/tracklist-tag/components/tracklist-tag-table-dialog/tracklist-tag-table-dialog.component';
import { TracklistTagLightResponseDto } from '../../../../tags-and-groups/tracklist-tag/models/response/tracklist-tag-light-response.dto';
import { TracklistTagAssociationService } from '../../../../tags-and-groups/tracklist-tag/services/tracklist-tag-association.service';
import { getTagTextColor } from '../../../../tags-and-groups/tracklist-tag/utils/tracklist-tag.utils';
import { TracklistResponseDto } from '../../models/response/tracklist-response.dto';
import { TracklistStatusEnum } from '../../models/enums/tracklist-status.enum';
import { TracklistService } from '../../services/tracklist.service';
import { parseTracklistDate } from '../../utils/tracklist-form.utils';

@Component({
    selector: 'app-tracklist-card',
    standalone: true,
    imports: [
        Button,
        Card,
        DatePipe,
        FitSingleLineTextDirective,
        Image,
        LanguageNamePipe,
        MediaTypePipe,
        RouterLink,
        SplitButton,
        Tag,
        Tooltip,
        TracklistStatusPipe,
    ],
    providers: [DialogService],
    templateUrl: './tracklist-card.component.html',
    styleUrl: './tracklist-card.component.css',
})
export class TracklistCardComponent implements OnChanges {
    @Input({ required: true }) tracklist!: TracklistResponseDto;
    @Input({ required: true }) media!: MediaDetailDataResponseDto;
    @Output() edit = new EventEmitter<TracklistResponseDto>();
    @Output() updated = new EventEmitter<TracklistResponseDto>();

    private readonly dialogs = inject(DialogService);
    private readonly tracklists = inject(TracklistService);
    private readonly associations = inject(TracklistTagAssociationService);
    private readonly messages = inject(MessageService, { optional: true });
    private readonly destroyRef = inject(DestroyRef);
    private readonly openRefs = new Set<DynamicDialogRef>();
    readonly busy = signal(false);
    readonly error = signal<string | null>(null);
    readonly failedPoster = signal<string | null>(null);
    readonly parseDate = parseTracklistDate;
    readonly tagTextColor = getTagTextColor;
    readonly tagUrls = TRACKLIST_TAG_URLS;
    readonly statusColors = TRACKLIST_STATUS_COLORS;
    readonly tagToolbarButtonTokens = {
        outlined: { primary: { borderColor: '{button.text.primary.color}' } },
    };

    constructor() {
        this.destroyRef.onDestroy(() => {
            for (const ref of this.openRefs) ref.destroy();
            this.openRefs.clear();
        });
    }

    tagActions: MenuItem[] = [];

    ngOnChanges(): void {
        this.tagActions = [
            {
                label: 'Tag erstellen',
                icon: 'pi pi-plus',
                command: () => this.createTag(),
            },
            {
                label: 'Tags entfernen',
                icon: 'pi pi-trash',
                disabled: !this.tracklist.tags.length,
                command: () => this.unlinkTags(),
            },
        ];
    }

    get posterPath(): string {
        return (
            this.tracklist.customPosterPath ||
            this.tracklist.media.posterPath ||
            this.media.posterPath ||
            ''
        );
    }

    imageUrl(original = false): string {
        return (
            (original ? TMDB_ORIGINAL_IMAGE_PATH : TMDB_POSTER_PATH).replace(
                /\/+$/,
                '',
            ) +
            '/' +
            this.posterPath.replace(/^\/+/, '')
        );
    }

    get elapsedText(): string {
        const date = parseTracklistDate(
            this.tracklist.finishDate || this.tracklist.startDate,
        );
        if (!date) return '–';
        const days = Math.ceil((Date.now() - date.getTime()) / 86400000);
        if (!this.tracklist.finishDate) return `Vor ${days} Tagen gestartet.`;
        return `Seit ${days} Tagen ${this.tracklist.status === TracklistStatusEnum.DROPPED ? 'abgebrochen' : 'abgeschlossen'}.`;
    }

    createTag(): void {
        if (this.busy()) return;
        const id = this.tracklist.id;
        this.open<TracklistTagLightResponseDto>(
            TracklistTagFormDialogComponent,
            { prefill: { tracklistId: id } },
            'Neuen Tag erstellen',
        ).subscribe((tag) => {
            if (tag && this.tracklist.id === id) this.refresh();
        });
    }

    linkTags(): void {
        if (this.busy()) return;
        const id = this.tracklist.id;
        this.open<TracklistTagLightResponseDto[]>(
            TracklistTagSelectionDialogComponent,
            { existingTagIds: this.tracklist.tags.map((tag) => tag.id) },
            'Tags zu Trackliste hinzufügen',
        ).subscribe((tags) => {
            if (!tags?.length || this.tracklist.id !== id || this.busy())
                return;
            this.updateTags(
                this.associations.addTagsToTracklist(
                    id,
                    tags.map((tag) => tag.id),
                ),
            );
        });
    }

    unlinkTags(): void {
        if (this.busy() || !this.tracklist.tags.length) return;
        const id = this.tracklist.id;
        this.open<TracklistTagLightResponseDto[]>(
            TracklistTagUnlinkDialogComponent,
            { tags: this.tracklist.tags },
            'Tags von Trackliste entfernen',
        ).subscribe((tags) => {
            if (!tags?.length || this.tracklist.id !== id || this.busy())
                return;
            this.updateTags(
                this.associations.removeTagsFromTracklist(
                    id,
                    tags.map((tag) => tag.id),
                ),
            );
        });
    }

    refresh(): void {
        if (!this.busy())
            this.runRequest(this.tracklists.getTracklist(this.tracklist.id));
    }

    private updateTags(request: Observable<void>): void {
        const id = this.tracklist.id;
        this.runRequest(
            request.pipe(switchMap(() => this.tracklists.getTracklist(id))),
        );
    }

    private runRequest(request: Observable<TracklistResponseDto>): void {
        const id = this.tracklist.id;
        this.busy.set(true);
        this.error.set(null);
        request
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.busy.set(false)),
            )
            .subscribe({
                next: (tracklist) => {
                    if (this.tracklist.id === id) this.updated.emit(tracklist);
                },
                error: () =>
                    this.error.set(
                        'Die Tags konnten nicht aktualisiert werden. Bitte lade die Trackliste erneut.',
                    ),
            });
    }

    async copyTagIds(): Promise<void> {
        if (!this.tracklist.tags.length) return;
        try {
            await navigator.clipboard.writeText(
                this.tracklist.tags.map((tag) => tag.id).join(','),
            );
            this.messages?.add({
                severity: 'success',
                summary: 'Erfolg',
                detail: 'Tag-IDs in Zwischenablage kopiert.',
            });
        } catch {
            this.messages?.add({
                severity: 'error',
                summary: 'Fehler',
                detail: 'Die Tag-IDs konnten nicht kopiert werden.',
            });
        }
    }

    openTagTable(): void {
        this.open<void>(
            TracklistTagTableDialogComponent,
            { tags: this.tracklist.tags },
            'Tracklisten-Tags',
        ).subscribe();
    }

    private open<T>(
        component: Type<unknown>,
        data: unknown,
        header: string,
    ): Observable<T | undefined> {
        const ref = this.dialogs.open(component, {
            data,
            header,
            modal: true,
            closable: true,
            closeOnEscape: true,
            dismissableMask: false,
            draggable: false,
            width: '60vw',
            style: { maxWidth: '64rem', maxHeight: 'calc(100dvh - 1rem)' },
            contentStyle: { overflow: 'auto' },
            breakpoints: { '1200px': '75vw', '960px': '90vw', '640px': '96vw' },
        });
        if (!ref) return EMPTY;
        this.openRefs.add(ref);
        ref.onClose
            .pipe(take(1), takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.openRefs.delete(ref));
        return ref.onClose.pipe(take(1), takeUntilDestroyed(this.destroyRef));
    }
}
