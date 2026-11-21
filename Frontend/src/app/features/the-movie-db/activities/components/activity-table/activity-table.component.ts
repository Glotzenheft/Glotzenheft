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

import { Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Tooltip } from 'primeng/tooltip';
import { Button } from 'primeng/button';
import { RuntimePipe } from '../../../../../shared/pipes/runtime/runtime.pipe';
import { ImageModule } from 'primeng/image';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { MediaType } from '../../../media/models/enums/media-type.enum';
import { ActivityDayResponseDto, ActivityMedia, ActivityScope, ActivitySortOrder, UserActivitiesResponse, UserActivity } from '../../../../../shared/interfaces/user-interfaces';
import { UC_GetUserActivites } from '../../../../../core/use-cases/user/get-user-activities.use-case';
import { UC_LogoutOfAccount } from '../../../../../core/use-cases/user/log-out-of-account.use-case';
import { ROUTES_LIST } from '../../../../../shared/variables/routes-list';
import { ERR_OBJECT_INVALID_AUTHENTICATION } from '../../../../../shared/variables/message-vars';
import { MEDIA_DETAILS_URLS } from '../../../../../core/constants/urls.constants';
import { TMDB_ORIGINAL_IMAGE_PATH, TMDB_POSTER_PATH } from '../../../../../shared/variables/tmdb-vars';
import { DatetimeWithUnitFormattingPipe } from '../../../../../shared/pipes/datetime-with-unit-formatting/datetime-with-unit-formatting.pipe';

type ActivityView = 'grouped' | 'activities' | 'days';

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
    providers: [UC_GetUserActivites, UC_LogoutOfAccount],
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
    protected readonly searchInput = signal('');
    private readonly search = toSignal(toObservable(this.searchInput).pipe(
        map(value => value.trim()), debounceTime(250), distinctUntilChanged(),
    ), { initialValue: '' });
    protected readonly sortOrder = signal<ActivitySortOrder>('desc');
    protected readonly loading = signal(true);
    protected readonly urls = MEDIA_DETAILS_URLS;
    protected readonly originalPosterPath = TMDB_ORIGINAL_IMAGE_PATH;
    protected readonly posterPath = TMDB_POSTER_PATH;
    protected readonly pageSizes = [10, 25, 50, 100, 250, 500];
    protected readonly rows = signal(50);
    protected readonly filter = signal<MediaType | 'all'>('all');
    protected readonly page = linkedSignal({
        source: () => [this.scope(), this.filter(), this.rows(), this.showMediaFilter(), this.sortOrder(), this.search()],
        computation: () => 1,
    });
    protected readonly view = signal<ActivityView>('grouped');
    protected readonly viewOptions = [
        { label: 'Aktivität und Tagestrenner', value: 'grouped', icon: 'pi pi-list' },
        { label: 'Nur Aktivität', value: 'activities', icon: 'pi pi-play' },
        { label: 'Nur Tagestrenner', value: 'days', icon: 'pi pi-calendar' },
    ];
    protected readonly response = signal<UserActivitiesResponse | null>(null);
    protected readonly error = signal('');
    private readonly attempt = signal(0);
    private readonly getActivities = inject(UC_GetUserActivites);
    private readonly logout = inject(UC_LogoutOfAccount);
    private readonly router = inject(Router);
    private readonly messages = inject(MessageService);
    private readonly dayFormat = new Intl.DateTimeFormat('de-DE', {
        weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC',
    });

    protected readonly days = computed(() => {
        const result = this.response();
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
        effect(onCleanup => {
            this.attempt();
            const media = this.media();
            const type = this.showMediaFilter() && !media ? this.filter() : undefined;
            const search = this.search();
            const request = this.getActivities.execute({
                user_activity_page: this.page(),
                items_per_page: this.rows(),
                sort_order: this.sortOrder(),
                ...(search && { search }),
                ...(type && type !== 'all' && { media_type: type }),
            }, this.scope());
            this.loading.set(true);
            this.error.set('');
            if (!request) {
                this.loading.set(false);
                this.error.set('Bitte melde dich an, um deine Aktivitäten zu sehen.');
                return;
            }
            const subscription = request.subscribe({
                next: result => {
                    if (result.page > Math.max(1, result.total_pages)) {
                        this.page.set(Math.max(1, result.total_pages));
                    } else {
                        this.response.set(result);
                        this.loading.set(false);
                    }
                },
                error: error => {
                    this.loading.set(false);
                    if (error.status === 401) {
                        this.logout.execute();
                        this.messages.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                        void this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                    }
                    this.error.set(error.status === 0 ? 'Server nicht erreichbar.' : 'Aktivitäten konnten nicht geladen werden.');
                },
            });
            onCleanup(() => subscription.unsubscribe());
        });
    }

    protected reverseSort(): void {
        this.sortOrder.update(order => order === 'desc' ? 'asc' : 'desc');
    }

    protected changePage(event: PaginatorState): void {
        if (event.rows !== undefined && event.rows !== this.rows()) {
            this.rows.set(event.rows);
        } else {
            this.page.set((event.page ?? 0) + 1);
        }
    }

    protected retry(): void {
        this.attempt.update(value => value + 1);
    }
}
