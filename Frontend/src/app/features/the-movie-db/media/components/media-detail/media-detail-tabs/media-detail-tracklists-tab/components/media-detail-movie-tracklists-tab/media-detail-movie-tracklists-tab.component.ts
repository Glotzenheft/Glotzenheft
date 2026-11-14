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

import { Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TracklistCardComponent } from '../../../../../../../tracklists/tracklist/components/tracklist-card/tracklist-card.component';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { TracklistResponseDto } from '../../../../../../../tracklists/tracklist/models/response/tracklist-response.dto';
import { TracklistFormDialogData } from '../../../../../../../tracklists/tracklist/models/tracklist-form-dialog-data';
import { TracklistFormDialogService } from '../../../../../../../tracklists/tracklist/services/tracklist-form-dialog.service';
import { MediaType } from '../../../../../../models/enums/media-type.enum';
import { MediaResponse } from '../../../../../../models/response/media-response.dto';
import { MediaDetailStateService } from '../../../../../../services/media-detail-state.service';

@Component({
    selector: 'app-media-detail-movie-tracklists-tab',
    standalone: true,
    imports: [Button, TracklistCardComponent],
    providers: [DialogService, TracklistFormDialogService],
    templateUrl: './media-detail-movie-tracklists-tab.component.html',
    styleUrl: './media-detail-movie-tracklists-tab.component.css',
})
export class MediaDetailMovieTracklistsTabComponent {
    private readonly state = inject(MediaDetailStateService);
    private readonly dialogs = inject(TracklistFormDialogService);
    private readonly destroyRef = inject(DestroyRef);

    @Input({ required: true }) mediaData!: MediaResponse;

    createTracklist(): void {
        if (this.mediaData.media.type !== MediaType.MOVIE) return;
        this.openDialog({
            mode: 'create',
            mediaType: MediaType.MOVIE,
            media: this.mediaData.media,
        });
    }

    editTracklist(tracklist: TracklistResponseDto): void {
        if (
            tracklist.media.id !== this.mediaData.media.id ||
            tracklist.media.type !== MediaType.MOVIE
        )
            return;
        this.openDialog({ mode: 'edit', tracklist });
    }

    updateTracklist(tracklist: TracklistResponseDto): void {
        this.state.upsertTracklist(tracklist);
    }

    private openDialog(data: TracklistFormDialogData): void {
        this.dialogs
            .open(data)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (!result) return;
                if (result.action === 'saved')
                    this.state.upsertTracklist(result.tracklist);
                else this.state.removeTracklist(result.tracklistId);
            });
    }
}
