import { Component, DestroyRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DatePicker } from 'primeng/datepicker';
import { DynamicDialogComponent, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PickList } from 'primeng/picklist';
import { SelectButton } from 'primeng/selectbutton';
import { finalize, timeout } from 'rxjs';
import { MediaSeasonEpisodeDetailResponseDto } from '../../../../media/models/response/media-season-episode-detail-response.dto';
import { TracklistSeasonEpisodeState } from '../../models/request/patch-tracklist-season-episodes-request.dto';
import { TracklistSeasonDetailDataDto } from '../../models/response/tracklist-season/tracklist-season-detail-data.dto';
import { TracklistSeasonService } from '../../services/tracklist-season.service';
import {
    EPISODE_REQUEST_TIMEOUT_MS,
    inTracklistRange,
    unknownEpisodeWriteResult,
} from '../../utils/tracklist-episode.utils';
import { formatTracklistDate, optionalDate, parseTracklistDate } from '../../utils/tracklist-form.utils';

export interface SeasonEpisodesDialogData {
    tracklistName: string;
    season: TracklistSeasonDetailDataDto;
    episodes: MediaSeasonEpisodeDetailResponseDto[];
    selectedIds?: number[];
    updateSeason: (season: TracklistSeasonDetailDataDto) => void;
}

interface EpisodeDraft {
    episode: MediaSeasonEpisodeDetailResponseDto;
    watched: boolean;
    date: FormControl<Date | string | null>;
    // undefined represents an absent sighting, null a sighting without a date.
    original: string | null | undefined;
}

@Component({
    selector: 'app-tracklist-season-episodes-dialog',
    imports: [Button, ConfirmDialog, DatePicker, FormsModule, PickList, ReactiveFormsModule, SelectButton],
    providers: [ConfirmationService],
    templateUrl: './tracklist-season-episodes-dialog.component.html',
    styleUrl: './tracklist-season-episodes-dialog.component.css',
    host: { '(keydown.escape)': 'onEscape($event)' },
})
export class TracklistSeasonEpisodesDialogComponent {
    private readonly config = inject<DynamicDialogConfig<SeasonEpisodesDialogData>>(DynamicDialogConfig);
    private readonly data = this.config.data!;
    readonly dialog = inject(DynamicDialogComponent, { optional: true });
    readonly title = this.data.tracklistName;
    readonly seasonNumber = this.data.season.season.seasonNumber;
    private readonly api = inject(TracklistSeasonService);
    private readonly ref = inject(DynamicDialogRef);
    private readonly confirmations = inject(ConfirmationService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly pickList = viewChild(PickList);
    private readonly episodes = [...this.data.episodes].sort((a, b) => a.episodeNumber - b.episodeNumber);
    private baseline = this.data.season;
    private readonly initialIds = new Set(this.data.selectedIds ?? this.rangeIds());
    readonly statuses = [
        { label: 'Geschaut', value: true },
        { label: 'Nicht geschaut', value: false },
    ];
    rows = this.makeDrafts();
    visible = new Set(this.initialIds);
    picking = false;
    source: MediaSeasonEpisodeDetailResponseDto[] = [];
    target: MediaSeasonEpisodeDetailResponseDto[] = [];
    pending = false;
    awaitingReconcile: TracklistSeasonEpisodeState[] | null = null;
    error = '';

    private rangeIds(): number[] {
        return this.episodes.filter((e) => inTracklistRange(e.episodeNumber, this.baseline)).map((e) => e.id);
    }

    private makeDrafts(desired: TracklistSeasonEpisodeState[] = []): EpisodeDraft[] {
        const sightings = new Map(
            this.baseline.tracklistEpisodes.map((te) => [te.episode.id, te.watchDateTime]),
        );
        const requested = new Map(desired.map((item) => [item.episode_id, item]));
        return this.episodes.map((episode) => {
            const original = sightings.get(episode.id);
            const state = requested.get(episode.id);
            return {
                episode,
                original,
                watched: state?.watched ?? sightings.has(episode.id),
                date: new FormControl<Date | string | null>(
                    parseTracklistDate(state?.watched ? state.watch_date_time : (original ?? null)),
                    optionalDate,
                ),
            };
        });
    }

    get locked(): boolean {
        return this.pending || !!this.awaitingReconcile;
    }

    effect(row: EpisodeDraft): string {
        if (!row.watched) return row.original === undefined ? '' : 'Wird entfernt';
        if (row.date.invalid) return 'Ungültiges Schaudatum';
        if (row.original === undefined) return 'Wird hinzugefügt';
        return this.formattedDate(row) === row.original ? '' : 'Datum geändert';
    }

    get changed(): EpisodeDraft[] {
        return this.rows.filter((row) => this.effect(row));
    }

    get canSave(): boolean {
        return (
            !this.locked &&
            this.changed.length > 0 &&
            !this.rows.some((row) => row.watched && row.date.invalid)
        );
    }

    get summary(): string {
        const changed = this.changed;
        const added = changed.filter((row) => row.watched && row.original === undefined).length;
        const dates = changed.filter((row) => row.watched && row.original !== undefined).length;
        const removed = changed.filter((row) => !row.watched).length;
        return (
            [
                added && `${added} hinzufügen`,
                dates && `${dates} Datum ändern`,
                removed && `${removed} entfernen`,
            ]
                .filter(Boolean)
                .join(' · ') || 'Keine Änderungen'
        );
    }

    get hiddenChanges(): EpisodeDraft[] {
        return this.changed.filter((row) => !this.visible.has(row.episode.id));
    }

    showChanged(): void {
        for (const row of this.hiddenChanges) this.visible.add(row.episode.id);
    }

    setWatched(row: EpisodeDraft, watched: boolean): void {
        row.watched = watched;
        this.updateDateControl(row);
    }

    // PrimeNG 19 processes keyboard input itself, but skips input events from e.g. mouse paste.
    readDateInput(row: EpisodeDraft, picker: DatePicker, event: Event): void {
        const text = (event.target as HTMLInputElement).value;
        let value: Date | string | null;
        try {
            const parsed = picker.parseValueFromString(text);
            value = parsed instanceof Date ? parsed : null;
        } catch {
            value = text;
        }
        row.date.setValue(value, { emitModelToViewChange: false });
    }

    private formattedDate(row: EpisodeDraft): string | null {
        const value = row.date.value;
        return formatTracklistDate(value instanceof Date ? value : null, true);
    }

    markVisible(watched: boolean): void {
        if (this.locked) return;
        for (const row of this.rows) {
            if (this.visible.has(row.episode.id)) this.setWatched(row, watched);
        }
    }

    setNow(row: EpisodeDraft): void {
        if (this.locked) return;
        this.setWatched(row, true);
        row.date.setValue(new Date());
    }

    private updateDateControl(row: EpisodeDraft): void {
        if (row.watched && !this.locked) row.date.enable();
        else row.date.disable();
    }

    constructor() {
        this.rows.forEach((row) => this.updateDateControl(row));
    }

    pick(ids = this.visible): void {
        this.source = this.episodes.filter((e) => !ids.has(e.id));
        this.target = this.episodes.filter((e) => ids.has(e.id));
        this.picking = true;
    }

    restoreRange(): void {
        const list = this.pickList();
        if (list) {
            list.selectedItemsSource = [];
            list.selectedItemsTarget = [];
            list.resetFilter();
        }
        this.pick(new Set(this.rangeIds()));
    }

    applyList(): void {
        this.visible = new Set(this.target.map((e) => e.id));
        this.picking = false;
    }

    reset(): void {
        if (this.locked) return;
        this.confirm(
            'Änderungen zurücksetzen?',
            'Status, Schaudaten und Episodenauswahl zurücksetzen?',
            'Zurücksetzen',
            () => {
                this.rows = this.makeDrafts();
                this.rows.forEach((row) => this.updateDateControl(row));
                this.visible = new Set(this.initialIds);
                this.error = '';
            },
        );
    }

    onEscape(event: Event): void {
        if (event.defaultPrevented) return;
        event.stopPropagation();
        if (this.picking) this.picking = false;
        else this.cancel();
    }

    cancel(): void {
        if (this.pending) return;
        if (this.changed.length)
            this.confirm(
                'Änderungen verwerfen?',
                'Ungespeicherte Änderungen an den Episoden verwerfen?',
                'Verwerfen',
                () => this.ref.close(),
            );
        else this.ref.close();
    }

    save(): void {
        if (!this.canSave) return;
        const episodes: TracklistSeasonEpisodeState[] = this.changed.map((row) =>
            row.watched
                ? { episode_id: row.episode.id, watched: true, watch_date_time: this.formattedDate(row) }
                : { episode_id: row.episode.id, watched: false },
        );
        const removed = episodes.filter((item) => !item.watched).length;
        if (removed)
            this.confirm(
                'Sichtungen entfernen?',
                `${removed === 1 ? '1 Sichtung' : removed + ' Sichtungen'} mit den zugehörigen Schaudaten entfernen und die Änderungen speichern?`,
                'Änderungen speichern',
                () => this.patch(episodes),
            );
        else this.patch(episodes);
    }

    private patch(episodes: TracklistSeasonEpisodeState[]): void {
        if (this.locked) return;
        this.setPending(true);
        this.api
            .patchEpisodes(this.baseline.id, { episodes })
            .pipe(
                timeout(EPISODE_REQUEST_TIMEOUT_MS),
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.setPending(false)),
            )
            .subscribe({
                next: (season) => {
                    this.data.updateSeason(season);
                    this.baseline = season;
                    this.rows = this.makeDrafts();
                    this.ref.close(true);
                },
                error: (error: unknown) => {
                    if (unknownEpisodeWriteResult(error)) {
                        this.awaitingReconcile = episodes;
                        this.error = 'Das Speicherergebnis ist unbekannt. Lade die Staffel zum Abgleich neu.';
                    } else this.error = 'Die Episoden konnten nicht gespeichert werden.';
                },
            });
    }

    reconcile(): void {
        const desired = this.awaitingReconcile;
        if (!desired || this.pending) return;
        this.setPending(true);
        this.api
            .getSeason(this.baseline.id)
            .pipe(
                timeout(EPISODE_REQUEST_TIMEOUT_MS),
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.setPending(false)),
            )
            .subscribe({
                next: (season) => {
                    this.baseline = season;
                    this.data.updateSeason(season);
                    this.rows = this.makeDrafts(desired);
                    this.awaitingReconcile = null;
                },
                error: () =>
                    (this.error = 'Die Staffel konnte nicht abgeglichen werden. Bitte erneut versuchen.'),
            });
    }

    private setPending(value: boolean): void {
        this.pending = value;
        if (value) this.error = '';
        this.rows.forEach((row) => this.updateDateControl(row));
    }

    private confirm(header: string, message: string, acceptLabel: string, accept: () => void): void {
        this.confirmations.confirm({
            key: 'season-episode-editor',
            header,
            message,
            acceptLabel,
            accept,
            rejectLabel: 'Zurück',
            defaultFocus: 'reject',
        });
    }
}
