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

import { computed, effect, inject, Injectable, linkedSignal, signal, untracked } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { UC_GetUserActivites } from '../../../../../core/use-cases/user/get-user-activities.use-case';
import { UC_LogoutOfAccount } from '../../../../../core/use-cases/user/log-out-of-account.use-case';
import {
    ActivityPageRequestDto,
    ActivityScope,
    ActivitySortOrder,
    UserActivitiesResponse,
} from '../../../../../shared/interfaces/user-interfaces';
import { ERR_OBJECT_INVALID_AUTHENTICATION } from '../../../../../shared/variables/message-vars';
import { ROUTES_LIST } from '../../../../../shared/variables/routes-list';
import { MediaType } from '../../../media/models/enums/media-type.enum';

type ActivityView = 'grouped' | 'activities' | 'days';

interface ActivityTableContext {
    scope?: ActivityScope;
    filterByMediaType: boolean;
}

@Injectable()
export class ActivityTableStateService {
    readonly searchInput = signal('');
    readonly sortOrder = signal<ActivitySortOrder>('desc');
    readonly rows = signal(50);
    readonly filter = signal<MediaType | 'all'>('all');
    readonly view = signal<ActivityView>('grouped');

    private readonly context = signal<ActivityTableContext | null>(null);
    private readonly search = toSignal(toObservable(this.searchInput).pipe(
        map(value => value.trim()), debounceTime(250), distinctUntilChanged(),
    ), { initialValue: '' });
    private readonly query = computed(() => {
        const context = this.context();
        if (!context) return null;

        const type = context.filterByMediaType ? this.filter() : 'all';
        const search = this.search();
        return {
            scope: context.scope,
            items_per_page: this.rows(),
            sort_order: this.sortOrder(),
            ...(search && { search }),
            ...(type !== 'all' && { media_type: type }),
        };
    });
    readonly page = linkedSignal({ source: this.query, computation: () => 1 });

    private readonly result = signal<UserActivitiesResponse | null>(null);
    private readonly busy = signal(true);
    private readonly loadError = signal('');
    readonly response = this.result.asReadonly();
    readonly loading = this.busy.asReadonly();
    readonly error = this.loadError.asReadonly();

    private readonly attempt = signal(0);
    private readonly getActivities = inject(UC_GetUserActivites);
    private readonly logout = inject(UC_LogoutOfAccount);
    private readonly router = inject(Router);
    private readonly messages = inject(MessageService);

    constructor() {
        effect(onCleanup => {
            const query = this.query();
            if (!query) return;

            this.attempt();
            const { scope, ...filters } = query;
            const params: ActivityPageRequestDto = { user_activity_page: this.page(), ...filters };
            const request = this.getActivities.execute(params, scope);
            this.busy.set(true);
            this.loadError.set('');
            if (!request) {
                this.busy.set(false);
                this.loadError.set('Bitte melde dich an, um deine Aktivitäten zu sehen.');
                return;
            }

            const subscription = request.subscribe({
                next: result => {
                    const lastPage = Math.max(1, result.total_pages);
                    if (result.page > lastPage) {
                        this.page.set(lastPage);
                    } else {
                        this.result.set(result);
                        this.busy.set(false);
                    }
                },
                error: error => {
                    this.busy.set(false);
                    if (error.status === 401) {
                        this.logout.execute();
                        this.messages.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                        void this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                    }
                    this.loadError.set(error.status === 0 ? 'Server nicht erreichbar.' : 'Aktivitäten konnten nicht geladen werden.');
                },
            });
            onCleanup(() => subscription.unsubscribe());
        });
    }

    setContext(scope: ActivityScope | undefined, filterByMediaType: boolean): void {
        const current = untracked(this.context);
        const sameScope = current?.scope?.id === scope?.id && current?.scope?.type === scope?.type;
        if (sameScope && current?.filterByMediaType === filterByMediaType) return;

        if (!sameScope) this.result.set(null);
        this.context.set({ scope, filterByMediaType });
    }

    reverseSort(): void {
        this.sortOrder.update(order => order === 'desc' ? 'asc' : 'desc');
    }

    retry(): void {
        this.attempt.update(value => value + 1);
    }
}

export const ACTIVITY_TABLE_STATE_PROVIDERS = [ActivityTableStateService, UC_GetUserActivites, UC_LogoutOfAccount];
