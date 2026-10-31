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

import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Tag } from 'primeng/tag';
import { TRACKLIST_TAG_URLS } from '../../../../../../core/constants/urls.constants';
import { TracklistTagLightResponseDto } from '../../models/response/tracklist-tag-light-response.dto';
import { getTagTextColor, groupTagsByCategory } from '../../utils/tracklist-tag.utils';

export interface TracklistTagTableDialogData {
    tags: TracklistTagLightResponseDto[];
}

@Component({
    selector: 'app-tracklist-tag-table-dialog',
    standalone: true,
    imports: [Button, RouterLink, Tag],
    templateUrl: './tracklist-tag-table-dialog.component.html',
    styleUrl: './tracklist-tag-table-dialog.component.css',
})
export class TracklistTagTableDialogComponent {
    private readonly dialogConfig = inject(DynamicDialogConfig);
    private readonly dialogRef = inject(DynamicDialogRef);
    private readonly messageService = inject(MessageService, { optional: true });

    readonly tags = (this.dialogConfig.data as TracklistTagTableDialogData | undefined)?.tags ?? [];
    readonly categories = computed(() => groupTagsByCategory(this.tags));
    readonly tagUrls = TRACKLIST_TAG_URLS;

    tagTextColor(color: string | null): string | undefined {
        return getTagTextColor(color);
    }

    async copyTagIds(tags: TracklistTagLightResponseDto[]): Promise<void> {
        if (!tags.length) return;
        try {
            await navigator.clipboard.writeText(tags.map((tag) => tag.id).join(','));
            this.messageService?.add({
                severity: 'success',
                summary: 'Erfolg',
                detail: 'Tag-IDs in Zwischenablage kopiert.',
            });
        } catch {
            this.messageService?.add({
                severity: 'error',
                summary: 'Fehler',
                detail: 'Die Tag-IDs konnten nicht kopiert werden.',
            });
        }
    }

    close(): void {
        this.dialogRef.close();
    }
}