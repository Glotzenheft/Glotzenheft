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

import {Component, computed, inject, Input, OnInit, signal, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Router, ActivatedRoute} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { TabsModule } from 'primeng/tabs';
import { Tooltip } from 'primeng/tooltip';
import { ChartModule } from 'primeng/chart';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

import { TracklistTagService } from '../../services/tracklist-tag.service';
import { TracklistTagFormDialogComponent } from '../tracklist-tag-form-dialog/tracklist-tag-form-dialog.component';
import { TRACKLIST_TAG_URLS} from '../../../../../../core/constants/urls.constants';
import { TracklistTagTypeLabelPipe } from '../../../../../../shared/pipes/tracklist-tags/tracklist-tag-type-label.pipe';
import { TracklistTagDetailStateService } from '../../services/tracklist-tag-detail-state.service';
import {TRACKLIST_TAG_PATHS} from '../../../../../../core/constants/paths.constants';
import { convertTracklistStatusIntoGerman } from '../../../../../../shared/variables/tracklist';
import { TracklistSelectionDialogComponent } from '../../../../tracklists/tracklist/components/tracklist-selection-dialog/tracklist-selection-dialog.component';
import { TracklistTagAssociationService } from '../../services/tracklist-tag-association.service';
import { TracklistUnlinkDialogComponent } from '../../../../tracklists/tracklist/components/tracklist-unlink-dialog/tracklist-unlink-dialog.component';
import { TracklistTracklistTagResponseDto} from '../../models/response/tracklist-tracklist-tag-response.dto';
import { TracklistSearchResponseDto } from '../../../../tracklists/tracklist/models/response/tracklist-search-response.dto';
import { RATING_COLORS, STATUS_COLORS, FALLBACK_COLOR, getHoverColor } from '../../../../../../core/constants/color.constants';

@Component({
    selector: 'app-tracklist-tag-detail',
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        TabsModule,
        TracklistTagTypeLabelPipe,
        Tooltip,
        ChartModule,
        ToggleSwitch,
        FormsModule
    ],
    providers: [
        DialogService,
        TracklistTagDetailStateService
    ],
    standalone: true,
    templateUrl: './tracklist-tag-detail.component.html',
    styleUrl: './tracklist-tag-detail.component.css'
})
export class TracklistTagDetailComponent implements OnInit{
    private tracklistTagService = inject(TracklistTagService);
    private tracklistTagAssociationService = inject(TracklistTagAssociationService);
    private dialogService = inject(DialogService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    @Input() tagId!: string;

    public state = inject(TracklistTagDetailStateService);

    activeTab: WritableSignal<string> = signal<string>('tracklists')
    paths = TRACKLIST_TAG_PATHS;

    showUnratedTracklists = signal<boolean>(true);

    totalTracklists = computed(() => this.state.tagData()?.tracklists?.length || 0);

    averageRating = computed(() => {
        const tracklists = this.state.tagData()?.tracklists || [];
        const ratedTracklists = tracklists.filter(t => t.tracklistRating !== null && t.tracklistRating !== undefined);
        if (ratedTracklists.length === 0) return 'N/A';
        const sum = ratedTracklists.reduce((acc, t) => acc + t.tracklistRating!, 0);
        return (sum / ratedTracklists.length).toFixed(1);
    });

    hoveredStatus = signal<{ label: string, value: number } | null>(null);
    hoveredRating = signal<{ label: string, value: number } | null>(null);

    statusCenterValue = computed(() => {
        const hover = this.hoveredStatus();
        if (hover) return hover.value.toString();
        if (this.totalTracklists() === 0) return '0';
        return this.totalTracklists().toString();
    });

    statusCenterLabel = computed(() => {
        const hover = this.hoveredStatus();
        if (hover) return hover.label;
        return 'Tracklisten';
    });

    ratingCenterValue = computed(() => {
        const hover = this.hoveredRating();
        if (hover) return hover.label === 'Keine' ? 'Ohne Bewertung' : `${hover.label} / 10`;
        return this.averageRating().toString();
    });

    ratingCenterLabel = computed(() => {
        const hover = this.hoveredRating();
        if (hover) return `${hover.value} Trackliste${hover.value !== 1 ? 'n' : ''}`;
        if (this.totalTracklists() === 0) return '-';
        return 'Ø Bewertung';
    });

    statusChartData = computed(() => {
        const tracklists = this.state.tagData()?.tracklists || [];

        if (tracklists.length === 0) {
            return {
                labels: ['Keine Daten'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['transparent'],
                    hoverBackgroundColor: ['transparent'],
                    borderColor: ['var(--tracklist-tag-detail-surface-border)'],
                    borderWidth: 2
                }]
            };
        }

        const statusCounts: Record<string, number> = {};
        tracklists.forEach(t => {
            const rawStatus = t.tracklistStatus || 'Unbekannt';
            const status = convertTracklistStatusIntoGerman(rawStatus) || rawStatus;
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const labels = Object.keys(statusCounts);
        const data = Object.values(statusCounts);

        const colors = labels.map(label => STATUS_COLORS[label] || FALLBACK_COLOR);
        const hoverColors = colors.map(color => getHoverColor(color, 20)); // Macht die Farbe 20% heller

        return {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: colors,
                    hoverBackgroundColor: hoverColors,
                    borderWidth: 0
                }
            ]
        };
    });

    ratingChartData = computed(() => {
        const tracklists = this.state.tagData()?.tracklists || [];
        const showUnrated = this.showUnratedTracklists();

        const filteredTracklists = tracklists.filter(t => {
            return !(!showUnrated && (t.tracklistRating === null || t.tracklistRating === undefined));
        });

        if (filteredTracklists.length === 0) {
            return {
                labels: ['Keine Daten'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['transparent'],
                    hoverBackgroundColor: ['transparent'],
                    borderColor: ['var(--tracklist-tag-detail-surface-border)'],
                    borderWidth: 2
                }]
            };
        }

        const ratingCounts: Record<string, number> = {};
        filteredTracklists.forEach(t => {
            const rating = t.tracklistRating !== null && t.tracklistRating !== undefined ? t.tracklistRating.toString() : 'Keine';
            ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
        });

        const labels = Object.keys(ratingCounts).sort((a, b) => {
            if (a === 'Keine') return 1;
            if (b === 'Keine') return -1;
            return Number(b) - Number(a);
        });

        const data = labels.map(label => ratingCounts[label]);

        const colors = labels.map(label => RATING_COLORS[label] || FALLBACK_COLOR);
        const hoverColors = colors.map(color => getHoverColor(color, 20));

        return {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: colors,
                    hoverBackgroundColor: hoverColors,
                    borderWidth: 0
                }
            ]
        };
    });

    statusChartOptions = computed(() => {
        return {
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            onHover: (event: any, elements: any[], chart: any) => {
                if (this.totalTracklists() === 0) {
                    this.hoveredStatus.set(null);
                    return;
                }
                if (elements.length > 0) {
                    const index = elements[0].index;
                    this.hoveredStatus.set({ label: chart.data.labels[index], value: chart.data.datasets[0].data[index] });
                } else {
                    this.hoveredStatus.set(null);
                }
            }
        };
    });

    ratingChartOptions = computed(() => {
        return {
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            onHover: (event: any, elements: any[], chart: any) => {
            if (chart.data.labels[0] === 'Keine Daten') {
                    this.hoveredRating.set(null);
                    return;
                }
                if (elements.length > 0) {
                    const index = elements[0].index;
                    this.hoveredRating.set({ label: chart.data.labels[index], value: chart.data.datasets[0].data[index] });
                } else {
                    this.hoveredRating.set(null);
                }
            }
        };
    });

    ngOnInit(): void {
        this.loadTag();
    }

    private loadTag(): void {
        this.state.isLoading.set(true);
        this.tracklistTagService.getTagWithTracklists(Number(this.tagId)).subscribe({
            next: (tag) => {
                this.state.tagData.set(tag);
                this.state.isLoading.set(false);
            },
            error: (err) => {
                console.error('Fehler beim Laden des Tags!', err);
                this.state.isLoading.set(false);
            }
        });
    }

    onTabChange(newRoute: string | number): void {
        const routeStr = newRoute.toString();
        this.activeTab.set(routeStr);
        void this.router.navigate([routeStr], { relativeTo: this.route });
    }

    openEditDialog(): void {
        const currentTag = this.state.tagData();
        if (!currentTag) return;

        const ref = this.dialogService.open(TracklistTagFormDialogComponent, {
            header: 'Neuen Tag erstellen',
            modal: true,
            width: '50vw',
            closable: true,
            contentStyle: {
                overflow: 'auto'
            },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            data: {
                tag: currentTag
            }
        });

        ref.onClose.subscribe((updatedTag) => {
            if (updatedTag) {
                this.loadTag();
            }
        });
    }

    openTracklistSelectionDialog(): void {
        const existingTracklistIds = this.state.tagData()?.tracklists?.map(t => t.id) || [];

        const ref = this.dialogService.open(TracklistSelectionDialogComponent, {
            header: 'Tracklisten zum Tag hinzufügen',
            modal: true,
            width: '60vw',
            closable: true,
            contentStyle: { overflow: 'hidden' },
            breakpoints: {
                '1200px': '75vw',
                '960px': '90vw'
            },
            data: {
                existingTracklistIds: existingTracklistIds
            }
        });

        ref.onClose.subscribe((selectedTracklists: TracklistSearchResponseDto[] | null) => {
            if (selectedTracklists && selectedTracklists.length > 0) {
                if (selectedTracklists.length === 1) {
                    this.tracklistTagAssociationService.addTracklistToTag(Number(this.tagId), selectedTracklists[0].id).subscribe({
                        next: () => {
                            this.loadTag();
                        },
                        error: (err) => console.error('Fehler beim Verknüpfen der Trackliste', err)
                    });
                } else {
                    const tracklistIds = selectedTracklists.map(t => t.id);
                    this.tracklistTagAssociationService.addTracklistsToTag(Number(this.tagId), tracklistIds).subscribe({
                        next: () => {
                            this.loadTag();
                        },
                        error: (err) => console.error('Fehler beim Verknüpfen der Tracklisten', err)
                    });
                }
            }
        });
    }

    openTracklistUnlinkDialog(): void {
        const tracklists = this.state.tagData()?.tracklists;
        if (!tracklists || tracklists.length === 0) return;

        const ref = this.dialogService.open(TracklistUnlinkDialogComponent, {
            header: 'Tracklisten vom Tag entfernen',
            modal: true,
            width: '60vw',
            closable: true,
            contentStyle: { overflow: 'hidden' },
            breakpoints: {
                '1200px': '75vw',
                '960px': '90vw'
            },
            data: {
                tracklists: tracklists
            }
        });

        ref.onClose.subscribe((selectedTracklists: TracklistTracklistTagResponseDto[] | null) => {
            if (selectedTracklists && selectedTracklists.length > 0) {
                const tracklistIds = selectedTracklists.map(t => t.id);
                if (selectedTracklists.length === 1) {
                    this.tracklistTagAssociationService.removeTracklistFromTag(Number(this.tagId), tracklistIds[0]).subscribe({
                        next: () => this.loadTag(),
                        error: (err) => console.error('Fehler beim Entfernen der Trackliste', err)
                    });
                } else {
                    this.tracklistTagAssociationService.removeTracklistsFromTag(Number(this.tagId), tracklistIds).subscribe({
                        next: () => this.loadTag(),
                        error: (err) => console.error('Fehler beim Entfernen der Tracklisten', err)
                    });
                }
            }
        });
    }

    deleteTag(): void {
        if(confirm('Möchtest du diesen Tag wirklich löschen?')) {
            this.tracklistTagService.deleteTag(Number(this.tagId)).subscribe({
                next: () => {
                    void this.router.navigate(['/' + TRACKLIST_TAG_URLS.overview]);
                },
                error: (err) => console.error('Fehler beim Löschen', err)
            });
        }
    }
}
