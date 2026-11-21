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

import { Component, computed, effect, inject, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Tooltip } from 'primeng/tooltip';
import { Button } from 'primeng/button';
import { RuntimePipe } from '../../../../../shared/pipes/runtime/runtime.pipe';
import { ImageModule } from 'primeng/image';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MediaType } from '../../../media/models/enums/media-type.enum';
import { ActivityDayResponseDto, ActivityMedia, ActivityScope, UserActivity } from '../../../../../shared/interfaces/user-interfaces';
import { MEDIA_DETAILS_URLS } from '../../../../../core/constants/urls.constants';
import { TMDB_ORIGINAL_IMAGE_PATH, TMDB_POSTER_PATH } from '../../../../../shared/variables/tmdb-vars';
import { DatetimeWithUnitFormattingPipe } from '../../../../../shared/pipes/datetime-with-unit-formatting/datetime-with-unit-formatting.pipe';

import { ACTIVITY_TABLE_STATE_PROVIDERS, ActivityTableStateService } from './activity-table-state.service';

interface ActivityDay {
    date: string;
    label: string;
    summary?: ActivityDayResponseDto;
    activities: UserActivity[];
}

@Component({
    selector: 'app-activity-table',
    imports: [CommonModule, FormsModule, RouterLink, ImageModule, NgOptimizedImage, PaginatorModule,
        ProgressSpinnerModule, DatetimeWithUnitFormattingPipe, RuntimePipe, InputText, Select, Tooltip, Button],
    providers: [ACTIVITY_TABLE_STATE_PROVIDERS],
    templateUrl: './activity-table.component.html',
    styleUrl: './activity-table.component.css',
})
export class ActivityTableComponent {
    readonly media = input<ActivityMedia>();
    readonly tagId = input<number>();
    private readonly scope = computed<ActivityScope | undefined>(() => {
        const tagId = this.tagId();
        return tagId === undefined ? this.media() : { type: 'tags', id: tagId };
    });
    readonly showMediaFilter = input(true);
    protected readonly mediaOptions = [
        { label: 'Alle Medien', value: 'all', icon: 'pi pi-filter' },
        { label: 'Filme', value: MediaType.MOVIE, icon: 'pi pi-video' },
        { label: 'Serien', value: MediaType.TV_SHOW, icon: 'pi pi-desktop' },
    ];
    // A detail page can keep the table state alive across routed tabs.
    protected readonly state = inject(ActivityTableStateService, { skipSelf: true, optional: true })
        ?? inject(ActivityTableStateService, { self: true });
    protected readonly urls = MEDIA_DETAILS_URLS;
    protected readonly originalPosterPath = TMDB_ORIGINAL_IMAGE_PATH;
    protected readonly posterPath = TMDB_POSTER_PATH;
    protected readonly pageSizes = [10, 25, 50, 100, 250, 500];
    protected readonly viewOptions = [
        { label: 'Aktivität und Tagestrenner', value: 'grouped', icon: 'pi pi-list' },
        { label: 'Nur Aktivität', value: 'activities', icon: 'pi pi-play' },
        { label: 'Nur Tagestrenner', value: 'days', icon: 'pi pi-calendar' },
    ];
    private readonly dayFormat = new Intl.DateTimeFormat('de-DE', {
        weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC',
    });

    protected readonly days = computed(() => {
        const result = this.state.response();
        if (!result) return [];
        const summaries = new Map(result.days.map(summary => [summary.day, summary]));
        const days: ActivityDay[] = [];
        for (const activity of result.results) {
            const date = activity.date.slice(0, 10);
            let day = days.at(-1);
            if (day?.date !== date) {
                day = { date, label: this.dayFormat.format(new Date(date)), summary: summaries.get(date), activities: [] };
                days.push(day);
            }
            day.activities.push(activity);
        }
        return days;
    });

    constructor() {
        effect(() => this.state.setContext(this.scope(), this.showMediaFilter() && !this.media()));
    }

    protected changePage(event: PaginatorState): void {
        if (event.rows !== undefined && event.rows !== this.state.rows()) {
            this.state.rows.set(event.rows);
        } else {
            this.state.page.set((event.page ?? 0) + 1);
        }
    }
}
