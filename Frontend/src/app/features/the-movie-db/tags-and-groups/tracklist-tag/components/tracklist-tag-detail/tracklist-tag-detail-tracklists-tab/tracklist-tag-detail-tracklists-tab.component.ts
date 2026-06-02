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

import {Component, computed, inject} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {TracklistTagDetailStateService} from '../../../services/tracklist-tag-detail-state.service';
import {RouterLink} from '@angular/router';
import {Card} from 'primeng/card';
import {PrimeTemplate} from 'primeng/api';

import {Image} from 'primeng/image';
import {DateFormattingPipe} from '../../../../../../../../pipes/date-formatting/date-formatting.pipe';
import {MediaTypePipe} from '../../../../../../../shared/pipes/media-type/media-type.pipe';
import {TracklistStatusPipe} from '../../../../../../../shared/pipes/tracklist-status/tracklist-status.pipe';
import {TracklistTracklistTagResponseDto} from '../../../models/response/tracklist-tracklist-tag-response.dto';
import {MediaType} from '../../../../../../media/models/media-type.enum';
import {LanguageNamePipe} from '../../../../../../../shared/pipes/language-name/language-name.pipe';
import {
    DatetimeWithUnitFormattingPipe
} from '../../../../../../../shared/pipes/datetime-with-unit-formatting/datetime-with-unit-formatting.pipe';
import {TmdbImagePipe} from '../../../../../../../shared/pipes/tmdb-image/tmdb-image.pipe';
import {Rating} from 'primeng/rating';
import {FormsModule} from '@angular/forms';
import {TRACKLIST_STATUS_COLORS} from '../../../../../../../core/constants/color.constants';

@Component({
    selector: 'app-tracklist-tag-detail-tracklists-tab',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        Card,
        PrimeTemplate,
        Image,
        NgOptimizedImage,
        DateFormattingPipe,
        MediaTypePipe,
        TracklistStatusPipe,
        LanguageNamePipe,
        DatetimeWithUnitFormattingPipe,
        TmdbImagePipe,
        Rating,
        FormsModule,
    ],
    templateUrl: './tracklist-tag-detail-tracklists-tab.component.html',
    styleUrl: './tracklist-tag-detail-tracklists-tab.component.css'
})
export class TracklistTagDetailTracklistsTabComponent {
    public state = inject(TracklistTagDetailStateService);

    public tracklists = computed<TracklistTracklistTagResponseDto[]>(() => {
        return this.state.tagData()?.tracklists ?? [];
    });

    protected readonly MediaType = MediaType;

    public star: number = 1;


    public getTotalEpisodes(tracklist: TracklistTracklistTagResponseDto): number | string {
        const first = tracklist.tracklistSeasonFirstEpisodeNumber;
        const last = tracklist.tracklistSeasonLastEpisodeNumber;

        if (first !== null && last !== null) {
            return (last - first) + 1;
        }

        return tracklist.mediaSeasonEpisodeCount ?? '-';
    }

    public getPosterPath(tracklist: TracklistTracklistTagResponseDto): string {
        return tracklist.tracklistCustomPosterPath
            || tracklist.mediaSeasonPosterPath
            || tracklist.mediaPosterPath
            || '';
    }

    public getDaysSinceStart(tracklist: TracklistTracklistTagResponseDto): number | null {
        const now = new Date();
        const startDate = tracklist.tracklistStartDateTime;

        if (startDate === null) return null;

        const parsedStartDate = new Date(startDate.replace(' ', 'T'));
        const diffInMs = now.getTime() - parsedStartDate.getTime();

        return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    }

    public getDaysSinceFinish(tracklist: TracklistTracklistTagResponseDto): number | null {
        const now = new Date();
        const finishDate = tracklist.tracklistFinishDateTime;

        if (finishDate === null) return null;

        const parsedFinishDate = new Date(finishDate.replace(' ', 'T'));
        const diffInMs = now.getTime() - parsedFinishDate.getTime();

        return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    }

    public getTracklistStatusColor(tracklist: TracklistTracklistTagResponseDto): string {
        if (!tracklist.tracklistStatus) return '';

        return TRACKLIST_STATUS_COLORS[tracklist.tracklistStatus as keyof typeof TRACKLIST_STATUS_COLORS];
    }
}
