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
import { Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { Rating } from 'primeng/rating';
import { Tag } from 'primeng/tag';
import { TRACKLIST_TAG_URLS } from '../../../../../../../../../core/constants/urls.constants';
import { LanguageNamePipe } from '../../../../../../../../../shared/pipes/language-name/language-name.pipe';
import { TracklistStatusPipe } from '../../../../../../../../../shared/pipes/tracklist-status/tracklist-status.pipe';
import { TracklistResponseDto } from '../../../../../../../tracklists/tracklist/models/response/tracklist-response.dto';
import { TracklistFormDialogData } from '../../../../../../../tracklists/tracklist/models/tracklist-form-dialog-data';
import { TracklistFormDialogService } from '../../../../../../../tracklists/tracklist/services/tracklist-form-dialog.service';
import { parseTracklistDate } from '../../../../../../../tracklists/tracklist/utils/tracklist-form.utils';
import { MediaType } from '../../../../../../models/enums/media-type.enum';
import { MediaResponse } from '../../../../../../models/response/media-response.dto';
import { MediaDetailStateService } from '../../../../../../services/media-detail-state.service';

@Component({
    selector: 'app-media-detail-movie-tracklists-tab',
    standalone: true,
    imports: [
        Button,
        Card,
        DatePipe,
        FormsModule,
        LanguageNamePipe,
        Rating,
        RouterLink,
        Tag,
        TracklistStatusPipe,
    ],
    providers: [DialogService, TracklistFormDialogService],
    templateUrl: './media-detail-movie-tracklists-tab.component.html',
    styleUrl: './media-detail-movie-tracklists-tab.component.css',
})
export class MediaDetailMovieTracklistsTabComponent {
    private readonly state = inject(MediaDetailStateService);
    private readonly dialogs = inject(TracklistFormDialogService);
    private readonly destroyRef = inject(DestroyRef);

    @Input({ required: true }) mediaData!: MediaResponse;

    readonly parseDate = parseTracklistDate;
    readonly tagUrls = TRACKLIST_TAG_URLS;

    createTracklist(): void {
        if (this.mediaData.media.type !== MediaType.MOVIE) return;
        this.openDialog({ mode: 'create', mediaType: MediaType.MOVIE, media: this.mediaData.media });
    }

    editTracklist(tracklist: TracklistResponseDto): void {
        if (tracklist.media.id !== this.mediaData.media.id || tracklist.media.type !== MediaType.MOVIE)
            return;
        this.openDialog({ mode: 'edit', tracklist });
    }

    tagTextColor(color: string | null): string | undefined {
        if (!color || !/^#(?:[a-f\d]{3}|[a-f\d]{6})$/i.test(color)) return undefined;
        let hex = color.slice(1);
        if (hex.length === 3) hex = [...hex].map((char) => char + char).join('');
        const [red, green, blue] = [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
        return (red * 299 + green * 587 + blue * 114) / 1000 >= 128 ? '#111827' : '#ffffff';
    }

    private openDialog(data: TracklistFormDialogData): void {
        this.dialogs
            .open(data)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (!result) return;
                if (result.action === 'saved') this.state.upsertTracklist(result.tracklist);
                else this.state.removeTracklist(result.tracklistId);
            });
    }
}
