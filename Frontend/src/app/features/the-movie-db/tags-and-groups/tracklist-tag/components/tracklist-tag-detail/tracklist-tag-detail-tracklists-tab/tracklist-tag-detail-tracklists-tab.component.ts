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

import {Component, computed, inject, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {TracklistTagDetailStateService} from '../../../services/tracklist-tag-detail-state.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
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
import {TracklistStatusEnum} from '../../../../../tracklists/tracklist/models/enums/tracklist-status.enum';
import {
    TRACKLIST_STATUS_LABELS_DE
} from '../../../../../tracklists/tracklist/models/constants/tracklist-status.constants';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Button} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelect} from 'primeng/multiselect';
import {InputText} from 'primeng/inputtext';

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
        Button,
        DropdownModule,
        MultiSelect,
        InputText,
    ],
    templateUrl: './tracklist-tag-detail-tracklists-tab.component.html',
    styleUrl: './tracklist-tag-detail-tracklists-tab.component.css'
})
export class TracklistTagDetailTracklistsTabComponent {
    public state = inject(TracklistTagDetailStateService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    public tracklists = computed<TracklistTracklistTagResponseDto[]>(() => {
        return this.state.tagData()?.tracklists ?? [];
    });

    protected readonly MediaType = MediaType;
    protected readonly TracklistStatus = TracklistStatusEnum;

    public star: number = 1;

    public searchQuery = signal<string>('');
    public sortBy = signal<string>('tracklistName');
    public sortOrder = signal<'asc' | 'desc'>('asc');
    public selectedStatuses = signal<TracklistStatusEnum[]>([]);
    public selectedMediaTypes = signal<MediaType[]>([]);
    public selectedRatings = signal<string[]>([]);

    public sortOptions = [
        { label: 'Name', value: 'tracklistName' },
        { label: 'Erscheinungsdatum', value: 'releaseDate' },
        { label: 'Anzahl Episoden', value: 'episodeCount' },
        { label: 'Bewertung', value: 'tracklistRating' },
        { label: 'Startdatum', value: 'tracklistStartDateTime' },
        { label: 'Enddatum', value: 'tracklistFinishDateTime' },
    ];

    public groupedFilters = [
        {
            label: 'Status',
            items: Object.values(TracklistStatusEnum).map(status => ({
                label: TRACKLIST_STATUS_LABELS_DE[status],
                value: status
            }))
        },
        {
            label: 'Medientyp',
            items: [
                { label: 'Film', value: MediaType.MOVIE },
                { label: 'Serie', value: MediaType.TV_SHOW },
            ]
        },
        {
            label: 'Bewertung',
            items: [
                { label: 'Bewertet', value: 'rated' },
                { label: 'Nicht bewertet', value: 'unrated' },
            ]
        }
    ];

    public selectedFilters = computed(() => {
        return [...this.selectedMediaTypes(), ...this.selectedStatuses(), ...this.selectedRatings()];
    });

    public filteredAndSortedTracklists = computed(() => {
        let list = this.tracklists();

        const search = this.searchQuery().toLowerCase();
        const statuses = this.selectedStatuses();
        const mediaTypes = this.selectedMediaTypes();
        const ratings = this.selectedRatings();

        // 1. Filtern
        if (search || statuses.length || mediaTypes.length || ratings.length) {
            list = list.filter(t => {
                const matchSearch = !search ||
                    (t.tracklistName?.toLowerCase().includes(search) ||
                        t.mediaName?.toLowerCase().includes(search) ||
                        t.mediaOriginalName?.toLowerCase().includes(search));

                const matchStatus = !statuses.length || (t.tracklistStatus && statuses.includes(t.tracklistStatus));
                const matchMediaType = !mediaTypes.length || (t.mediaType && mediaTypes.includes(t.mediaType));
                const matchRating = !ratings.length ||
                    (ratings.includes('rated') && t.tracklistRating !== null) ||
                    (ratings.includes('unrated') && t.tracklistRating === null);

                return matchSearch && matchStatus && matchMediaType && matchRating;
            });
        }

        // 2. Sortieren
        const sortBy = this.sortBy();
        const sortOrder = this.sortOrder() === 'asc' ? 1 : -1;

        list = [...list].sort((a, b) => {
            let valA: any = a[sortBy as keyof TracklistTracklistTagResponseDto];
            let valB: any = b[sortBy as keyof TracklistTracklistTagResponseDto];

            if (sortBy === 'releaseDate') {
                valA = a.tracklistCustomAirDate ?? a.mediaSeasonAirDate ?? a.mediaFirstAirDate ?? '';
                valB = b.tracklistCustomAirDate ?? b.mediaSeasonAirDate ?? b.mediaFirstAirDate ?? '';
            } else if (sortBy === 'episodeCount') {
                const countA = this.getTotalEpisodes(a);
                const countB = this.getTotalEpisodes(b);
                valA = a.mediaType === MediaType.MOVIE ? 1 : (typeof countA === 'number' ? countA : parseInt(countA as string, 10) || 0);
                valB = b.mediaType === MediaType.MOVIE ? 1 : (typeof countB === 'number' ? countB : parseInt(countB as string, 10) || 0);
            }

            if (valA === valB) return 0;
            if (valA === null || valA === undefined || valA === '') return 1; // Leere/Null Werte immer ans Ende packen
            if (valB === null || valB === undefined || valB === '') return -1;

            if (typeof valA === 'string' && typeof valB === 'string') {
                return valA.localeCompare(valB) * sortOrder;
            }

            return (valA < valB ? -1 : 1) * sortOrder;
        });

        return list;
    });

    constructor() {
        this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
            const paramSearch = params['search'] || '';
            if (this.searchQuery() !== paramSearch) {
                this.searchQuery.set(paramSearch);
            }

            const paramSortBy = params['sortBy'] || 'tracklistName';
            if (this.sortBy() !== paramSortBy) {
                this.sortBy.set(paramSortBy);
            }

            const paramSortOrder = params['sortOrder'] || 'asc';
            if (this.sortOrder() !== paramSortOrder) {
                this.sortOrder.set(paramSortOrder as 'asc' | 'desc');
            }

            const paramStatus = params['status'] ? params['status'].split(',').filter(Boolean) : [];
            if (this.selectedStatuses().join(',') !== paramStatus.join(',')) {
                this.selectedStatuses.set(paramStatus as TracklistStatusEnum[]);
            }

            const paramMediaType = params['mediaType'] ? params['mediaType'].split(',').filter(Boolean) : [];
            if (this.selectedMediaTypes().join(',') !== paramMediaType.join(',')) {
                this.selectedMediaTypes.set(paramMediaType as MediaType[]);
            }

            const paramRating = params['rating'] ? params['rating'].split(',').filter(Boolean) : [];
            if (this.selectedRatings().join(',') !== paramRating.join(',')) {
                this.selectedRatings.set(paramRating);
            }
        });
    }

    public onFilterChange(values: string[]): void {
        const types = values.filter(v => Object.values(MediaType).includes(v as MediaType)) as MediaType[];
        const statuses = values.filter(v => Object.values(TracklistStatusEnum).includes(v as TracklistStatusEnum)) as TracklistStatusEnum[];
        const ratings = values.filter(v => ['rated', 'unrated'].includes(v));

        this.selectedMediaTypes.set(types);
        this.selectedStatuses.set(statuses);
        this.selectedRatings.set(ratings);
        this.updateQueryParams();
    }

    public updateQueryParams(): void {
        void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                search: this.searchQuery() || null,
                sortBy: this.sortBy() === 'tracklistName' ? null : this.sortBy(),
                sortOrder: this.sortOrder() === 'asc' ? null : this.sortOrder(),
                status: this.selectedStatuses().length ? this.selectedStatuses().join(',') : null,
                mediaType: this.selectedMediaTypes().length ? this.selectedMediaTypes().join(',') : null,
                rating: this.selectedRatings().length ? this.selectedRatings().join(',') : null,
            },
            queryParamsHandling: 'merge'
        });
    }

    public toggleSortOrder(): void {
        this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
        this.updateQueryParams();
    }

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
