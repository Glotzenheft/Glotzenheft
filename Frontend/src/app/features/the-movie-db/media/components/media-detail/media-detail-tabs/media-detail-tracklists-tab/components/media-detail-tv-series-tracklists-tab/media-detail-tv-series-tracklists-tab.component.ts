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

import { Component, computed, DestroyRef, inject, Input, signal, Type } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { Button } from 'primeng/button';
import { Carousel } from 'primeng/carousel';
import { Dialog } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Image } from 'primeng/image';
import { Message } from 'primeng/message';
import { Panel } from 'primeng/panel';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { EMPTY, finalize, Observable, switchMap, take } from 'rxjs';
import { MediaResponse } from '../../../../../../models/response/media-response.dto';
import { MediaType } from '../../../../../../models/enums/media-type.enum';
import { MediaDetailStateService } from '../../../../../../services/media-detail-state.service';
import { MediaSeasonEpisodeDetailResponseDto } from '../../../../../../models/response/media-season-episode-detail-response.dto';
import { TracklistResponseDto } from '../../../../../../../tracklists/tracklist/models/response/tracklist-response.dto';
import { TracklistFormDialogService } from '../../../../../../../tracklists/tracklist/services/tracklist-form-dialog.service';
import { TracklistFormDialogData } from '../../../../../../../tracklists/tracklist/models/tracklist-form-dialog-data';
import { TracklistSelectionService } from '../../../../../../../tracklists/tracklist/services/tracklist-selection.service';
import { TracklistService } from '../../../../../../../tracklists/tracklist/services/tracklist.service';
import { TracklistEpisodeFormDialogComponent } from '../../../../../../../tracklists/tracklist-episode/components/tracklist-episode-form-dialog/tracklist-episode-form-dialog.component';
import { TracklistEpisodeDialogResult } from '../../../../../../../tracklists/tracklist-episode/models/tracklist-episode-dialog-data';
import { TracklistTagSelectionDialogComponent } from '../../../../../../../tags-and-groups/tracklist-tag/components/tracklist-tag-selection-dialog/tracklist-tag-selection-dialog.component';
import { TracklistTagUnlinkDialogComponent } from '../../../../../../../tags-and-groups/tracklist-tag/components/tracklist-tag-unlink-dialog/tracklist-tag-unlink-dialog.component';
import { TracklistTagFormDialogComponent } from '../../../../../../../tags-and-groups/tracklist-tag/components/tracklist-tag-form-dialog/tracklist-tag-form-dialog.component';
import { TracklistTagAssociationService } from '../../../../../../../tags-and-groups/tracklist-tag/services/tracklist-tag-association.service';
import { TracklistTagLightResponseDto } from '../../../../../../../tags-and-groups/tracklist-tag/models/response/tracklist-tag-light-response.dto';
import { TRACKLIST_TAG_TYPE_OPTIONS } from '../../../../../../../tags-and-groups/tracklist-tag/models/constants/tracklist-tag-type.constants';
import { TRACKLIST_STATUS_LABELS_DE } from '../../../../../../../tracklists/tracklist/models/constants/tracklist-status.constants';
import { parseTracklistDate } from '../../../../../../../tracklists/tracklist/utils/tracklist-form.utils';
import { LanguageNamePipe } from '../../../../../../../../../shared/pipes/language-name/language-name.pipe';
import { TRACKLIST_TAG_URLS } from '../../../../../../../../../core/constants/urls.constants';
import { STATUS_COLORS } from '../../../../../../../../../core/constants/color.constants';
import {
    TMDB_POSTER_PATH,
    TMDB_ORIGINAL_IMAGE_PATH,
} from '../../../../../../../../../shared/variables/tmdb-vars';

@Component({
    selector: 'app-media-detail-tv-series-tracklists-tab',
    standalone: true,
    imports: [
        AccordionModule,
        Button,
        Carousel,
        Dialog,
        FormsModule,
        Image,
        Message,
        Panel,
        RouterLink,
        Select,
        Tag,
        Tooltip,
    ],
    providers: [DialogService, TracklistFormDialogService],
    templateUrl: './media-detail-tv-series-tracklists-tab.component.html',
    styleUrl: './media-detail-tv-series-tracklists-tab.component.css',
})
export class MediaDetailTvSeriesTracklistsTabComponent {
    private readonly state = inject(MediaDetailStateService);
    private readonly forms = inject(TracklistFormDialogService);
    private readonly dialogs = inject(DialogService);
    private readonly selections = inject(TracklistSelectionService);
    private readonly tracklists = inject(TracklistService);
    private readonly associations = inject(TracklistTagAssociationService);
    private readonly messages = inject(MessageService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly media = signal<MediaResponse | null>(null);
    private readonly selectedIds = signal<Record<number, number>>({});
    private readonly allEpisodes = signal<ReadonlySet<number>>(new Set());
    private readonly openRefs = new Set<DynamicDialogRef>();
    private readonly languages = new LanguageNamePipe();
    private readonly dateFormat = new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    private readonly timeFormat = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' });

    readonly data = this.media.asReadonly();
    readonly activeSeasonId = signal<string | number>('');
    readonly tagView = signal<'inline' | 'table'>('inline');
    readonly tagBusy = signal(false);
    readonly tagError = signal<string | null>(null);
    readonly retryTracklistId = signal<number | null>(null);
    readonly posterErrors = signal<ReadonlySet<number>>(new Set());
    readonly episodeDetails = signal<{
        episode: MediaSeasonEpisodeDetailResponseDto;
        sightingId: number | null;
    } | null>(null);
    readonly episodeImageError = signal(false);
    readonly tagUrls = TRACKLIST_TAG_URLS;
    readonly statusLabels = TRACKLIST_STATUS_LABELS_DE;
    readonly statusColors = STATUS_COLORS;
    readonly metadataPages = ['info', 'ids'];

    @Input({ required: true }) set mediaData(value: MediaResponse) {
        const previous = this.media();
        const sameMedia = previous?.media.id === value.media.id && previous.media.type === value.media.type;
        const previousIds = sameMedia ? this.selectedIds() : {};
        const ids: Record<number, number> = {};
        for (const season of value.media.seasons) {
            const options = value.tracklists.filter((item) => item.tracklistSeason?.season.id === season.id);
            const wanted = previousIds[season.id] ?? this.selections.get(value.media.id, season.id);
            const selected = options.find((item) => item.id === wanted) ?? options.at(0);
            if (selected) ids[season.id] = selected.id;
        }
        if (!sameMedia) {
            this.activeSeasonId.set('');
            this.allEpisodes.set(new Set());
            this.posterErrors.set(new Set());
        }
        this.media.set(value);
        this.selectedIds.set(ids);
    }

    readonly panels = computed(() => {
        const data = this.media();
        if (!data) return [];
        const selectedIds = this.selectedIds();
        const all = this.allEpisodes();
        return [...data.media.seasons]
            .sort((a, b) => a.seasonNumber - b.seasonNumber)
            .map((season) => {
                const options = data.tracklists.filter(
                    (item) => item.tracklistSeason?.season.id === season.id,
                );
                const tracklist =
                    options.find((item) => item.id === selectedIds[season.id]) ?? options.at(0) ?? null;
                const range = tracklist?.tracklistSeason;
                const hasBoundaries =
                    !!range && (range.startEpisodeNumber !== null || range.endEpisodeNumber !== null);
                const sightings = new Map(
                    range?.tracklistEpisodes.map((item) => [item.episode.id, item]) ?? [],
                );
                const episodes = [...season.episodes]
                    .sort((a, b) => a.episodeNumber - b.episodeNumber)
                    .filter(
                        (episode) =>
                            all.has(season.id) ||
                            !range ||
                            ((range.startEpisodeNumber === null ||
                                episode.episodeNumber >= range.startEpisodeNumber) &&
                                (range.endEpisodeNumber === null ||
                                    episode.episodeNumber <= range.endEpisodeNumber)),
                    );
                return {
                    season,
                    options,
                    tracklist,
                    hasBoundaries,
                    showAll: all.has(season.id),
                    details: tracklist ? this.tracklistDetails(tracklist) : [],
                    identifiers: [
                        { label: 'Tracklist ID', value: String(tracklist?.id ?? '–') },
                        { label: 'Tracklist-Staffel ID', value: String(range?.id ?? '–') },
                        { label: 'Staffel ID', value: String(season.id) },
                        { label: 'TMDB-Staffel ID', value: String(season.tmdbSeasonId) },
                    ],
                    categories: TRACKLIST_TAG_TYPE_OPTIONS.map((category) => ({
                        ...category,
                        tags: tracklist?.tags.filter((tag) => tag.tracklistTagType === category.value) ?? [],
                    })),
                    episodes: episodes.map((episode, index) => ({
                        episode,
                        sighting: sightings.get(episode.id),
                        title: this.episodeTitle(episode, index),
                    })),
                };
            });
    });

    constructor() {
        this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            this.tagView.set(params.get('tagView') === 'table' ? 'table' : 'inline');
        });
        this.destroyRef.onDestroy(() => {
            for (const ref of this.openRefs) ref.destroy();
            this.openRefs.clear();
        });
    }

    onSeasonChange(value: string | number | string[] | number[] | null | undefined): void {
        this.activeSeasonId.set(value === null || value === undefined || Array.isArray(value) ? '' : value);
    }

    selectTracklist(seasonId: number, tracklistId: number): void {
        const data = this.media();
        if (
            !data ||
            !data.tracklists.some(
                (item) => item.id === tracklistId && item.tracklistSeason?.season.id === seasonId,
            )
        )
            return;
        this.rememberSelection(seasonId, tracklistId);
    }

    createTracklist(seasonId: number): void {
        const data = this.media();
        const season = data?.media.seasons.find((item) => item.id === seasonId);
        if (!data || data.media.type !== MediaType.TV_SHOW || !season || this.tagBusy()) return;
        this.openTracklistForm({ mode: 'create', mediaType: MediaType.TV_SHOW, media: data.media, season });
    }

    editTracklist(tracklist: TracklistResponseDto): void {
        if (this.isCurrentTracklist(tracklist) && !this.tagBusy())
            this.openTracklistForm({ mode: 'edit', tracklist });
    }

    private openTracklistForm(data: TracklistFormDialogData): void {
        const mediaId = this.media()?.media.id;
        this.forms
            .open(data)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (!result || this.media()?.media.id !== mediaId) return;
                if (result.action === 'saved') {
                    const seasonId = result.tracklist.tracklistSeason?.season.id;
                    if (
                        result.tracklist.media.id !== mediaId ||
                        result.tracklist.media.type !== MediaType.TV_SHOW ||
                        !this.media()?.media.seasons.some((item) => item.id === seasonId)
                    )
                        return;
                    this.state.upsertTracklist(result.tracklist);
                    if (seasonId !== undefined) this.rememberSelection(seasonId, result.tracklist.id);
                } else {
                    const deleted = this.media()?.tracklists.find((item) => item.id === result.tracklistId);
                    this.state.removeTracklist(result.tracklistId);
                    const seasonId = deleted?.tracklistSeason?.season.id;
                    if (seasonId !== undefined && this.selectedIds()[seasonId] === result.tracklistId) {
                        const next = this.state
                            .mediaData()
                            ?.tracklists.find((item) => item.tracklistSeason?.season.id === seasonId);
                        this.rememberSelection(seasonId, next?.id ?? null);
                    }
                }
            });
    }

    trackEpisode(tracklist: TracklistResponseDto | null, episode: MediaSeasonEpisodeDetailResponseDto): void {
        if (!tracklist || !this.isCurrentTracklist(tracklist) || !tracklist.tracklistSeason || this.tagBusy())
            return;
        const season = this.media()?.media.seasons.find(
            (item) => item.id === tracklist.tracklistSeason?.season.id,
        );
        if (!season?.episodes.some((item) => item.id === episode.id)) return;
        const sighting = tracklist.tracklistSeason.tracklistEpisodes.find(
            (item) => item.episode.id === episode.id,
        );
        this.openAuxiliary<TracklistEpisodeDialogResult>(
            TracklistEpisodeFormDialogComponent,
            {
                tracklistId: tracklist.id,
                tracklistSeasonId: tracklist.tracklistSeason.id,
                tracklistName: tracklist.tracklistName,
                episode,
                sighting,
            },
            sighting ? 'Episode bearbeiten' : 'Episode tracken',
        ).subscribe((result) => {
            if (result?.action === 'saved') this.state.upsertTracklistEpisode(tracklist.id, result.episode);
            else if (result?.action === 'deleted')
                this.state.removeTracklistEpisode(tracklist.id, result.tracklistEpisodeId);
        });
    }

    onEpisodeDetailsVisibilityChange(visible: boolean): void {
        if (!visible) this.episodeDetails.set(null);
    }

    showEpisodeDetails(episode: MediaSeasonEpisodeDetailResponseDto, sightingId?: number): void {
        this.episodeImageError.set(false);
        this.episodeDetails.set({ episode, sightingId: sightingId ?? null });
    }

    toggleEpisodeFilter(seasonId: number): void {
        this.allEpisodes.update((current) => {
            const next = new Set(current);
            if (next.has(seasonId)) next.delete(seasonId);
            else next.add(seasonId);
            return next;
        });
    }

    createTag(tracklist: TracklistResponseDto): void {
        if (!this.isCurrentTracklist(tracklist) || this.tagBusy()) return;
        this.openAuxiliary<TracklistTagLightResponseDto>(
            TracklistTagFormDialogComponent,
            { prefill: { tracklistId: tracklist.id } },
            'Neuen Tag erstellen',
        ).subscribe((tag) => {
            if (tag) this.refreshTracklist(tracklist.id);
        });
    }

    linkTags(tracklist: TracklistResponseDto): void {
        if (!this.isCurrentTracklist(tracklist) || this.tagBusy()) return;
        this.openAuxiliary<TracklistTagLightResponseDto[]>(
            TracklistTagSelectionDialogComponent,
            { existingTagIds: tracklist.tags.map((tag) => tag.id) },
            'Tags zu Trackliste hinzufügen',
        ).subscribe((tags) => {
            if (!tags?.length || !this.isCurrentTracklist(tracklist) || this.tagBusy()) return;
            this.updateTags(
                tracklist.id,
                this.associations.addTagsToTracklist(
                    tracklist.id,
                    tags.map((tag) => tag.id),
                ),
            );
        });
    }

    unlinkTags(tracklist: TracklistResponseDto): void {
        if (!this.isCurrentTracklist(tracklist) || this.tagBusy() || !tracklist.tags.length) return;
        this.openAuxiliary<TracklistTagLightResponseDto[]>(
            TracklistTagUnlinkDialogComponent,
            { tags: tracklist.tags },
            'Tags von Trackliste entfernen',
        ).subscribe((tags) => {
            if (!tags?.length || !this.isCurrentTracklist(tracklist) || this.tagBusy()) return;
            this.updateTags(
                tracklist.id,
                this.associations.removeTagsFromTracklist(
                    tracklist.id,
                    tags.map((tag) => tag.id),
                ),
            );
        });
    }

    refreshTracklist(tracklistId: number): void {
        if (this.tagBusy() || !this.media()?.tracklists.some((item) => item.id === tracklistId)) return;
        this.runTagRequest(tracklistId, this.tracklists.getTracklist(tracklistId));
    }

    private updateTags(tracklistId: number, request: Observable<void>): void {
        this.runTagRequest(
            tracklistId,
            request.pipe(switchMap(() => this.tracklists.getTracklist(tracklistId))),
        );
    }

    private runTagRequest(id: number, request: Observable<TracklistResponseDto>): void {
        this.tagBusy.set(true);
        this.tagError.set(null);
        this.retryTracklistId.set(null);
        request
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.tagBusy.set(false)),
            )
            .subscribe({
                next: (tracklist) => this.state.upsertTracklist(tracklist),
                error: () => {
                    this.tagError.set(
                        'Die Tags konnten nicht aktualisiert werden. Bitte lade die betroffene Trackliste erneut.',
                    );
                    this.retryTracklistId.set(id);
                },
            });
    }

    toggleTagView(): void {
        const view = this.tagView() === 'inline' ? 'table' : 'inline';
        this.tagView.set(view);
        void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { tagView: view === 'table' ? 'table' : null },
            queryParamsHandling: 'merge',
        });
    }

    async copyTagIds(tags: TracklistTagLightResponseDto[]): Promise<void> {
        if (!tags.length) return;
        try {
            await navigator.clipboard.writeText(tags.map((tag) => tag.id).join(','));
            this.messages.add({
                severity: 'success',
                summary: 'Erfolg',
                detail: 'Tag-IDs in Zwischenablage kopiert.',
            });
        } catch {
            this.messages.add({
                severity: 'error',
                summary: 'Fehler',
                detail: 'Die Tag-IDs konnten nicht kopiert werden.',
            });
        }
    }

    markPosterError(seasonId: number): void {
        this.posterErrors.update((current) => new Set([...current, seasonId]));
    }

    imageUrl(path: string | null, original = false): string {
        return path
            ? (original ? TMDB_ORIGINAL_IMAGE_PATH : TMDB_POSTER_PATH).replace(/\/+$/, '') +
                  '/' +
                  path.replace(/^\/+/, '')
            : '';
    }

    formatDate(value: string | null, withTime = false): string {
        const date = parseTracklistDate(value);
        if (!date) return '–';
        return this.dateFormat.format(date) + (withTime ? ` ${this.timeFormat.format(date)} Uhr` : '');
    }

    tagTextColor(color: string | null): string | undefined {
        if (!color || !/^#(?:[a-f\d]{3}|[a-f\d]{6})$/i.test(color)) return undefined;
        let hex = color.slice(1);
        if (hex.length === 3) hex = [...hex].map((char) => char + char).join('');
        const [r, g, b] = [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
        return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? '#111827' : '#ffffff';
    }

    private rememberSelection(seasonId: number, tracklistId: number | null): void {
        this.selectedIds.update((current) => {
            const next = { ...current };
            if (tracklistId === null) delete next[seasonId];
            else next[seasonId] = tracklistId;
            return next;
        });
        const mediaId = this.media()?.media.id;
        if (mediaId !== undefined) this.selections.set(mediaId, seasonId, tracklistId);
    }

    private isCurrentTracklist(tracklist: TracklistResponseDto): boolean {
        return (
            tracklist.media.id === this.media()?.media.id &&
            tracklist.media.type === MediaType.TV_SHOW &&
            !!this.media()?.tracklists.some((item) => item.id === tracklist.id)
        );
    }

    private openAuxiliary<T>(
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

    private episodeTitle(episode: MediaSeasonEpisodeDetailResponseDto, index: number): string {
        const pad = (number: number) => String(number).padStart(2, '0');
        const prefix =
            index + 1 !== episode.episodeNumber
                ? `E${pad(index + 1)} (E${pad(episode.episodeNumber)})`
                : `E${pad(episode.episodeNumber)}`;
        return `${prefix}: ${episode.name}`;
    }

    private tracklistDetails(tracklist: TracklistResponseDto) {
        const season = tracklist.tracklistSeason;
        return [
            {
                label: 'Startdatum',
                value: this.formatDate(tracklist.startDate),
                title: this.formatDate(tracklist.startDate, true),
            },
            { label: 'Bewertung', value: tracklist.rating === null ? '–' : `${tracklist.rating} / 10` },
            { label: 'Sprache', value: this.languages.transform(tracklist.language) },
            { label: 'Erste Episode', value: String(season?.startEpisodeNumber ?? '–') },
            {
                label: 'Enddatum',
                value: this.formatDate(tracklist.finishDate),
                title: this.formatDate(tracklist.finishDate, true),
            },
            { label: 'Status', value: TRACKLIST_STATUS_LABELS_DE[tracklist.status] },
            { label: 'Untertitel', value: this.languages.transform(tracklist.subtitle) },
            { label: 'Letzte Episode', value: String(season?.endEpisodeNumber ?? '–') },
            {
                label: 'Erstelldatum',
                value: this.formatDate(tracklist.createdAt),
                title: this.formatDate(tracklist.createdAt, true),
            },
            { label: 'Erneut glotzen?', value: tracklist.isRewatching ? 'Ja' : 'Nein' },
            { label: 'Staffelnummer', value: String(season?.customSeasonNumber ?? '–') },
            {
                label: 'Zuletzt geändert',
                value: this.formatDate(tracklist.updatedAt),
                title: this.formatDate(tracklist.updatedAt, true),
            },
            { label: 'Eigenes Erscheinungsdatum', value: this.formatDate(tracklist.customAirDate) },
            { label: 'Eigenes Poster?', value: tracklist.customPosterPath ? 'Ja' : 'Nein' },
            { label: 'Part', value: String(season?.customPartNumber ?? '–') },
        ];
    }
}
