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
import { RouterLink } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Checkbox } from 'primeng/checkbox';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { SplitButton } from 'primeng/splitbutton';
import { HttpErrorResponse } from '@angular/common/http';
import {
    EpisodeSelectionToolbarComponent,
    EpisodeSelectionMode,
} from './episode-selection-toolbar.component';
import { TracklistEpisodeService } from '../../../../../../../tracklists/tracklist-episode/services/tracklist-episode.service';
import {
    TracklistSeasonEpisodesDialogComponent,
    SeasonEpisodesDialogData,
} from '../../../../../../../tracklists/tracklist/components/tracklist-season-episodes-dialog/tracklist-season-episodes-dialog.component';
import {
    EPISODE_REQUEST_TIMEOUT_MS,
    inTracklistRange,
    unknownEpisodeWriteResult,
} from '../../../../../../../tracklists/tracklist/utils/tracklist-episode.utils';
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
import { EMPTY, finalize, Observable, switchMap, take, timeout } from 'rxjs';
import { TracklistEpisodeDetailDataDto } from '../../../../../../../tracklists/tracklist/models/response/tracklist-season/tracklist-episode/tracklist-episode-detail-data.dto';
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
import { TracklistTagTableDialogComponent } from '../../../../../../../tags-and-groups/tracklist-tag/components/tracklist-tag-table-dialog/tracklist-tag-table-dialog.component';
import { TracklistTagAssociationService } from '../../../../../../../tags-and-groups/tracklist-tag/services/tracklist-tag-association.service';
import { TracklistTagLightResponseDto } from '../../../../../../../tags-and-groups/tracklist-tag/models/response/tracklist-tag-light-response.dto';
import { getTagTextColor } from '../../../../../../../tags-and-groups/tracklist-tag/utils/tracklist-tag.utils';
import { TRACKLIST_STATUS_LABELS_DE } from '../../../../../../../tracklists/tracklist/models/constants/tracklist-status.constants';
import { parseTracklistDate } from '../../../../../../../tracklists/tracklist/utils/tracklist-form.utils';
import { LanguageNamePipe } from '../../../../../../../../../shared/pipes/language-name/language-name.pipe';
import { TRACKLIST_TAG_URLS } from '../../../../../../../../../core/constants/urls.constants';
import { TRACKLIST_STATUS_COLORS } from '../../../../../../../../../core/constants/color.constants';
import {
    TMDB_POSTER_PATH,
    TMDB_ORIGINAL_IMAGE_PATH,
} from '../../../../../../../../../shared/variables/tmdb-vars';

interface EpisodeSelection {
    tracklist: TracklistResponseDto;
    tracklistSeasonId: number;
    mode: EpisodeSelectionMode;
    visibleIds: Set<number>;
}

interface EpisodeRow {
    episode: MediaSeasonEpisodeDetailResponseDto;
    sighting?: { id: number };
}

@Component({
    selector: 'app-media-detail-tv-series-tracklists-tab',
    standalone: true,
    imports: [
        AccordionModule,
        Button,
        Carousel,
        Checkbox,
        ConfirmDialog,
        SplitButton,
        EpisodeSelectionToolbarComponent,
        Dialog,
        FormsModule,
        Image,
        LanguageNamePipe,
        Message,
        Panel,
        RouterLink,
        Select,
        Tag,
        Tooltip,
    ],
    providers: [DialogService, TracklistFormDialogService, ConfirmationService],
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
    private readonly destroyRef = inject(DestroyRef);
    private readonly media = signal<MediaResponse | null>(null);
    private readonly selectedIds = signal<Record<number, number>>({});
    private readonly allEpisodes = signal<ReadonlySet<number>>(new Set());
    private readonly openRefs = new Set<DynamicDialogRef>();
    private readonly dateFormat = new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    private readonly timeFormat = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' });

    private readonly episodeApi = inject(TracklistEpisodeService);
    private readonly confirmation = inject(ConfirmationService);
    readonly selection = signal<EpisodeSelection | null>(null);
    readonly marked = signal<ReadonlySet<number>>(new Set());
    readonly episodeBusy = signal(false);
    readonly episodeError = signal('');
    readonly reloadStatus = signal<'available' | 'required' | null>(null);

    readonly data = this.media.asReadonly();
    readonly activeSeasonId = signal<string | number>('');
    readonly tagToolbarButtonTokens = {
        outlined: {
            primary: {
                borderColor: '{button.text.primary.color}',
            },
        },
    };
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
    readonly statusColors = TRACKLIST_STATUS_COLORS;
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
        const selecting = this.selection();
        if (selecting) {
            const season = value.tracklists.find(
                (item) => item.id === selecting.tracklist.id,
            )?.tracklistSeason;
            if (
                !sameMedia ||
                season?.id !== selecting.tracklistSeasonId ||
                ids[season.season.id] !== selecting.tracklist.id
            ) {
                this.endSelection();
            }
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
                const selection = this.selection();
                const visibleIds =
                    selection && selection.tracklist.id === tracklist?.id ? selection.visibleIds : null;
                const episodes = [...season.episodes]
                    .sort((a, b) => a.episodeNumber - b.episodeNumber)
                    .filter((episode) =>
                        visibleIds
                            ? visibleIds.has(episode.id)
                            : all.has(season.id) || !range || inTracklistRange(episode.episodeNumber, range),
                    );
                return {
                    season,
                    options,
                    tracklist,
                    hasBoundaries,
                    bulkMenu: this.bulkMenu(tracklist, episodes, sightings),
                    showAll: all.has(season.id),
                    identifiers: [
                        { label: 'Tracklist Id', value: String(tracklist?.id ?? '–') },
                        { label: 'Tracklist-Staffel Id', value: String(range?.id ?? '–') },
                        { label: 'Glotzenheft Staffel Id', value: String(season.id) },
                        { label: 'TMDB-Staffel Id', value: String(season.tmdbSeasonId) },
                    ],
                    episodes: episodes.map((episode, index) => ({
                        episode,
                        sighting: sightings.get(episode.id),
                        title: this.episodeTitle(episode, index),
                    })),
                };
            });
    });

    readonly eligibleIds = computed(() => {
        const selection = this.selection();
        const panel = this.panels().find((item) => item.tracklist?.id === selection?.tracklist.id);
        if (!selection || !panel) return [];
        return panel.episodes
            .map((row) => this.selectionId(row, selection.mode))
            .filter((id) => id !== undefined);
    });

    readonly selectedEligible = computed(() => this.eligibleIds().filter((id) => this.marked().has(id)));

    selectionId(row: EpisodeRow, mode: EpisodeSelectionMode): number | undefined {
        if (mode === 'remove') return row.sighting?.id;
        if (mode === 'add' && row.sighting) return undefined;
        return row.episode.id;
    }

    private bulkMenu(
        tracklist: TracklistResponseDto | null,
        episodes: MediaSeasonEpisodeDetailResponseDto[],
        sightings: ReadonlyMap<number, unknown>,
    ): MenuItem[] {
        const tracklistSeasonId = tracklist?.tracklistSeason?.id;
        if (!tracklist || tracklistSeasonId === undefined) return [];
        const ids = episodes.map((e) => e.id);
        const start = (mode: EpisodeSelectionMode) => {
            this.endSelection();
            this.selection.set({ mode, tracklist, tracklistSeasonId, visibleIds: new Set(ids) });
        };
        return [
            {
                label: 'Episoden auswählen und bearbeiten',
                disabled: !ids.length,
                command: () => start('edit'),
            },
            {
                label: 'Episoden auswählen und entfernen',
                disabled: !ids.some((id) => sightings.has(id)),
                command: () => start('remove'),
            },
            {
                label: 'Episoden auswählen und ohne Datum hinzufügen',
                disabled: !ids.some((id) => !sightings.has(id)),
                command: () => start('add'),
            },
        ];
    }

    endSelection(): void {
        this.selection.set(null);
        this.marked.set(new Set());
        this.episodeBusy.set(false);
        this.episodeError.set('');
        this.reloadStatus.set(null);
    }

    toggleRow(id: number | undefined): void {
        if (id === undefined || this.episodeBusy()) return;
        const next = new Set(this.marked());
        if (next.has(id)) next.delete(id);
        else next.add(id);
        this.marked.set(next);
    }

    toggleAll(): void {
        if (this.episodeBusy()) return;
        const ids = this.eligibleIds();
        this.marked.set(new Set(this.selectedEligible().length === ids.length ? [] : ids));
    }

    openEpisodeEditor(tracklist: TracklistResponseDto, selectedIds?: number[]): void {
        const season = this.media()?.media.seasons.find((s) => s.id === tracklist.tracklistSeason?.season.id);
        if (!season || !tracklist.tracklistSeason) return;
        const data: SeasonEpisodesDialogData = {
            tracklistName: tracklist.tracklistName,
            season: tracklist.tracklistSeason,
            episodes: season.episodes,
            selectedIds,
            updateSeason: (updated) => this.state.replaceTracklistSeason(tracklist, updated),
        };
        const selection = this.selection();
        this.openAuxiliary<boolean>(
            TracklistSeasonEpisodesDialogComponent,
            data,
            `Episoden bearbeiten · Staffel ${season.seasonNumber} · ${tracklist.tracklistName}`,
            false,
        ).subscribe((saved) => {
            if (saved && selection === this.selection()) this.endSelection();
        });
    }

    proceed(): void {
        const selection = this.selection();
        const ids = this.selectedEligible();
        if (!selection || !ids.length || this.episodeBusy() || this.reloadStatus() === 'required') return;
        const tracklist = this.panels().find((p) => p.tracklist?.id === selection.tracklist.id)?.tracklist;
        if (!tracklist?.tracklistSeason) return;
        if (selection.mode === 'edit') {
            this.openEpisodeEditor(tracklist, ids);
            return;
        }
        const add = selection.mode === 'add';
        const label = add ? 'Hinzufügen' : 'Entfernen';
        const episodes = ids.length === 1 ? '1 Episode' : `${ids.length} Episoden`;
        const sightings = ids.length === 1 ? '1 Sichtung' : `${ids.length} Sichtungen`;
        this.confirmation.confirm({
            key: 'season-episode-selection',
            header: `Episoden ${label.toLowerCase()}`,
            message: add
                ? `${episodes} ohne Schaudatum zu „${tracklist.tracklistName}“ hinzufügen?`
                : `${sightings} aus „${tracklist.tracklistName}“ entfernen? Die zugehörigen Schaudaten gehen verloren.`,
            acceptLabel: label,
            rejectLabel: 'Zurück',
            defaultFocus: 'reject',
            accept: () => this.writeSelection(selection, ids),
        });
    }

    private writeSelection(selection: EpisodeSelection, ids: number[]): void {
        if (selection !== this.selection() || this.episodeBusy() || this.reloadStatus() === 'required')
            return;
        const tracklist = selection.tracklist;
        const add = selection.mode === 'add';
        const request: Observable<TracklistEpisodeDetailDataDto[] | void> = add
            ? this.episodeApi.createBulkTracklistEpisodes({
                  episodes: ids.map((episode_id) => ({
                      tracklist_id: tracklist.id,
                      tracklist_season_id: selection.tracklistSeasonId,
                      episode_id,
                      watch_date_time: null,
                  })),
              })
            : this.episodeApi.deleteBulkTracklistEpisodes(ids);
        this.episodeBusy.set(true);
        this.episodeError.set('');

        request.pipe(timeout(EPISODE_REQUEST_TIMEOUT_MS), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (created) => {
                if (created) this.state.addTracklistEpisodes(tracklist, created);
                else if (!add) this.state.removeTracklistEpisodes(tracklist, ids);
                if (selection === this.selection()) this.endSelection();
            },
            error: (err: unknown) => {
                if (selection !== this.selection()) return;
                this.episodeBusy.set(false);
                if (unknownEpisodeWriteResult(err)) {
                    this.reloadStatus.set('required');
                    this.episodeError.set(
                        'Das Speicherergebnis ist unbekannt. Lade die Trackliste zum Abgleich neu.',
                    );
                    return;
                }
                if (err instanceof HttpErrorResponse && [404, 409].includes(err.status))
                    this.reloadStatus.set('available');
                this.episodeError.set(
                    `Die Episoden konnten nicht ${add ? 'hinzugefügt' : 'entfernt'} werden.`,
                );
            },
        });
    }

    reloadSelection(): void {
        const selection = this.selection();
        if (!selection || this.episodeBusy() || !this.reloadStatus()) return;
        this.episodeBusy.set(true);
        this.tracklists
            .getTracklist(selection.tracklist.id)
            .pipe(timeout(EPISODE_REQUEST_TIMEOUT_MS), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (tracklist) => {
                    if (this.selection() !== selection) return;
                    this.episodeBusy.set(false);
                    const season = tracklist.tracklistSeason;
                    if (
                        !season ||
                        season.id !== selection.tracklistSeasonId ||
                        tracklist.id !== selection.tracklist.id
                    ) {
                        this.endSelection();
                        return;
                    }
                    const loaded = this.state
                        .mediaData()
                        ?.tracklists.find((item) => item.id === tracklist.id);
                    if (loaded?.tracklistSeason?.id !== season.id) {
                        this.endSelection();
                        return;
                    }
                    this.state.upsertTracklist(tracklist);
                    const removing = selection.mode === 'remove';
                    const existing = new Set(
                        season.tracklistEpisodes.map((te) => (removing ? te.id : te.episode.id)),
                    );
                    this.marked.update(
                        (ids) => new Set([...ids].filter((id) => removing === existing.has(id))),
                    );
                    this.reloadStatus.set(null);
                    this.episodeError.set('');
                },
                error: () => {
                    if (this.selection() !== selection) return;
                    this.episodeBusy.set(false);
                    this.episodeError.set(
                        'Die Trackliste konnte für den Episodenabgleich nicht geladen werden.',
                    );
                },
            });
    }

    constructor() {
        this.destroyRef.onDestroy(() => {
            for (const ref of this.openRefs) ref.destroy();
            this.openRefs.clear();
        });
    }

    onSeasonChange(value: string | number | string[] | number[] | null | undefined): void {
        if (value !== this.activeSeasonId()) this.endSelection();
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

    openTagTable(tracklist: TracklistResponseDto): void {
        this.openAuxiliary<void>(
            TracklistTagTableDialogComponent,
            { tags: tracklist.tags },
            'Tracklisten-Tags',
        ).subscribe();
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
        return getTagTextColor(color);
    }

    private rememberSelection(seasonId: number, tracklistId: number | null): void {
        if (this.selectedIds()[seasonId] !== tracklistId) this.endSelection();
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
        useDefaultHeader = true,
    ): Observable<T | undefined> {
        const ref = this.dialogs.open(component, {
            data,
            header,
            modal: true,
            showHeader: useDefaultHeader,
            closable: useDefaultHeader,
            closeOnEscape: useDefaultHeader,
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

}
