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

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
    createSeriesEpisode,
    createSeriesTracklist,
    createEpisodeSighting,
} from '../../../../media/testing/media-detail.fixtures';
import { formatTracklistDate, parseTracklistDate } from '../../utils/tracklist-form.utils';
import {
    SeasonEpisodesDialogData,
    TracklistSeasonEpisodesDialogComponent,
} from './tracklist-season-episodes-dialog.component';

describe('TracklistSeasonEpisodesDialogComponent', () => {
    const url = '/api/tracklist-seasons/50';
    const before = '2026-11-20 19:00:00';
    const after = '2026-11-24 21:30:12';
    const episodes = [7, 6, 5, 4, 3, 2, 1].map((n) => createSeriesEpisode(300 + n, n));
    const sighting = (n: number, date: string | null) =>
        createEpisodeSighting({
            id: 700 + n,
            episode: createSeriesEpisode(300 + n, n),
            watchDateTime: date,
        });
    const season = createSeriesTracklist(
        {},
        {
            startEpisodeNumber: 3,
            endEpisodeNumber: 6,
            tracklistEpisodes: [sighting(3, before), sighting(4, before), sighting(6, null)],
        },
    ).tracklistSeason!;
    let fixture: ComponentFixture<TracklistSeasonEpisodesDialogComponent>;
    let editor: TracklistSeasonEpisodesDialogComponent;
    let http: HttpTestingController;
    let close: jasmine.Spy;
    let updateSeason: jasmine.Spy;
    let confirmation: jasmine.Spy<ConfirmationService['confirm']>;
    let data: SeasonEpisodesDialogData;

    beforeEach(() => {
        close = jasmine.createSpy('close');
        updateSeason = jasmine.createSpy('updateSeason');
        data = { tracklistName: 'Meine Trackliste', season, episodes, updateSeason };
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideNoopAnimations(),
                { provide: DynamicDialogConfig, useValue: { data } },
                { provide: DynamicDialogRef, useValue: { close } },
            ],
        });
        http = TestBed.inject(HttpTestingController);
    });

    function open(selectedIds?: number[]) {
        data.selectedIds = selectedIds;
        fixture = TestBed.createComponent(TracklistSeasonEpisodesDialogComponent);
        editor = fixture.componentInstance;
        confirmation = spyOn(fixture.debugElement.injector.get(ConfirmationService), 'confirm');
        fixture.detectChanges();
    }

    function accept() {
        confirmation.calls.mostRecent().args[0].accept!();
    }
    function row(n: number) {
        return editor.rows.find((r) => r.episode.episodeNumber === n)!;
    }
    function titles(): string[] {
        return Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.episode strong')).map((e) =>
            e.textContent!.trim(),
        );
    }
    function changeDate(n: number) {
        row(n).date.setValue(parseTracklistDate(after));
    }
    function patch() {
        return http.expectOne({ method: 'PATCH', url: url + '/episodes' });
    }
    afterEach(() => http.verify());

    it('opens the inclusive range, independent of catalogue order, with open-ended bounds supported', () => {
        open();
        expect(titles()).toEqual([3, 4, 5, 6].map((n) => `E${n} · Episode ${n}`));
        fixture.destroy();
        data.season = { ...season, startEpisodeNumber: null, endEpisodeNumber: 2 };
        open();
        expect(titles().length).toBe(2);
        fixture.destroy();
        data.season = { ...season, endEpisodeNumber: null };
        open();
        expect(titles().length).toBe(5);
        fixture.destroy();
        data.season = { ...season, startEpisodeNumber: null, endEpisodeNumber: null };
        open();
        expect(titles().length).toBe(7);
    });

    it('keeps an inactive draft date, omits its unchanged episode, and can create a sighting without a date', async () => {
        open([305]);
        const element = fixture.nativeElement as HTMLElement;
        const buttons = element.querySelectorAll<HTMLButtonElement>('p-selectbutton button');
        const date = element.querySelector<HTMLInputElement>('p-datepicker input')!;
        await fixture.whenStable();
        expect(date.disabled).toBeTrue();
        expect(date.value).toBe('');
        async function choose(index: number) {
            buttons[index].click();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
        }
        await choose(0);
        expect(row(5).watched).toBeTrue();
        changeDate(5);
        await choose(1);
        expect(row(5).date.disabled).toBeTrue();
        expect(editor.canSave).toBeFalse();
        await choose(0);
        expect(row(5).date.value).toEqual(parseTracklistDate(after));
        row(5).date.setValue(null);
        editor.save();
        const req = patch();
        expect(req.request.body).toEqual({
            episodes: [{ episode_id: 305, watched: true, watch_date_time: null }],
        });
        req.flush({ ...season, tracklistEpisodes: [...season.tracklistEpisodes, sighting(5, null)] });
        expect(close).toHaveBeenCalledOnceWith(true);
    });

    function clickButton(label: string, root: ParentNode = fixture.nativeElement): void {
        const button = Array.from(root.querySelectorAll('button')).find(
            (el) => el.textContent?.trim() === label || el.getAttribute('aria-label') === label,
        );
        if (!button) throw new Error('Missing button: ' + label);
        button.click();
        fixture.detectChanges();
    }

    it('marks only visible drafts, preserves dates and confirms the final removal before PATCH', () => {
        open([303, 305]);
        changeDate(4);
        clickButton('Alle als geschaut markieren');
        expect(row(5).watched).toBeTrue();
        expect(row(5).date.value).toBeNull();
        expect(row(3).date.value).toEqual(parseTracklistDate(before));
        clickButton('Alle als nicht geschaut markieren');
        expect(row(5).watched).toBeFalse();
        expect(row(3).date.value).toEqual(parseTracklistDate(before));
        expect(row(4).watched).toBeTrue();
        expect(row(4).date.value).toEqual(parseTracklistDate(after));
        http.expectNone(url + '/episodes');
        editor.save();
        http.expectNone(url + '/episodes');
        accept();
        const req = patch();
        expect(req.request.body.episodes).toEqual([
            { episode_id: 303, watched: false },
            { episode_id: 304, watched: true, watch_date_time: after },
        ]);
        req.flush(season);
    });

    it('sets a previously unwatched episode to the current local time and only writes on save', fakeAsync(() => {
        open([305]);
        const now = new Date(Date.now());
        clickButton('Jetzt für E5');
        expect(row(5).watched).toBeTrue();
        expect(row(5).date.enabled).toBeTrue();
        expect(row(5).date.value).toEqual(now);
        http.expectNone(url + '/episodes');
        editor.save();
        const request = patch();
        expect(request.request.body.episodes).toEqual([
            { episode_id: 305, watched: true, watch_date_time: formatTracklistDate(now, true) },
        ]);
        request.flush(season);
    }));

    for (const action of ['Änderungen zurücksetzen', 'Abbrechen']) {
        it(
            'renders exactly one confirmation for ' + action + ' and clears it after each decision',
            fakeAsync(() => {
                open([303]);
                confirmation.and.callThrough();
                expect(fixture.nativeElement.querySelector('h2').textContent).toContain(data.tracklistName);
                changeDate(3);
                for (const decision of ['Zurück', 'close', 'accept']) {
                    clickButton(action);
                    tick();
                    fixture.detectChanges();
                    const dialogs = document.querySelectorAll('.p-confirmdialog');
                    expect(dialogs.length).toBe(1);
                    if (decision === 'close') {
                        dialogs[0].querySelector<HTMLButtonElement>('.p-dialog-close-button')!.click();
                    } else {
                        const label =
                            decision === 'accept'
                                ? action === 'Abbrechen'
                                    ? 'Verwerfen'
                                    : 'Zurücksetzen'
                                : decision;
                        clickButton(label, dialogs[0]);
                    }
                    fixture.detectChanges();
                    tick();
                    expect(document.querySelectorAll('.p-confirmdialog').length).toBe(0);
                    if (decision !== 'accept') expect(editor.changed.length).toBe(1);
                }
                if (action === 'Abbrechen') expect(close).toHaveBeenCalledOnceWith();
                else expect(editor.changed).toEqual([]);
            }),
        );
    }

    it('shows hours and minutes, preserves stored seconds on open and accepts minute input', async () => {
        data.season = { ...season, tracklistEpisodes: [sighting(3, '2026-11-20 19:00:42')] };
        open([303]);
        await fixture.whenStable();
        fixture.detectChanges();
        const picker: HTMLElement = fixture.nativeElement.querySelector('p-datepicker');
        const input = picker.querySelector('input')!;
        expect(input.value).toBe('20.11.2026 19:00');
        picker.querySelector('button')!.click();
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(document.querySelector('.p-datepicker-hour-picker')).toBeTruthy();
        expect(document.querySelector('.p-datepicker-minute-picker')).toBeTruthy();
        expect(document.querySelector('.p-datepicker-second-picker')).toBeNull();
        expect(editor.canSave).toBeFalse();

        input.value = '24.11.2026 21:30:12';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(row(3).date.invalid).toBeTrue();
        input.value = '24.11.2026 21:30';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        editor.save();
        const request = patch();
        expect(request.request.body.episodes).toEqual([
            { episode_id: 303, watched: true, watch_date_time: '2026-11-24 21:30:00' },
        ]);
        request.flush(season);
    });

    it('sets and clears two watch dates without replacing the sightings', () => {
        open([303, 304]);
        changeDate(3);
        row(4).date.setValue(null);
        editor.save();
        const req = patch();
        expect(req.request.body).toEqual({
            episodes: [
                { episode_id: 303, watched: true, watch_date_time: after },
                { episode_id: 304, watched: true, watch_date_time: null },
            ],
        });
        const saved = {
            ...season,
            tracklistEpisodes: [sighting(3, after), sighting(4, null), sighting(6, null)],
        };
        req.flush(saved);
        expect(updateSeason).toHaveBeenCalledOnceWith(saved);
    });

    it('confirms a mixed patch, prevents duplicate submits and keeps the entire draft on 404', () => {
        open();
        changeDate(3);
        editor.setWatched(row(4), false);
        editor.setWatched(row(5), true);
        editor.save();
        http.expectNone(url + '/episodes');
        expect(confirmation.calls.mostRecent().args[0].rejectLabel).toBe('Zurück');
        editor.save();
        accept();
        accept();
        editor.save();
        const req = patch();
        expect(req.request.body).toEqual({
            episodes: [
                { episode_id: 303, watched: true, watch_date_time: after },
                { episode_id: 304, watched: false },
                { episode_id: 305, watched: true, watch_date_time: null },
            ],
        });
        req.flush(null, { status: 404, statusText: 'Not Found' });
        expect(updateSeason).not.toHaveBeenCalled();
        expect(close).not.toHaveBeenCalled();
        expect(editor.error).toBeTruthy();
        expect(editor.summary).toBe('1 hinzufügen · 1 Datum ändern · 1 entfernen');
    });

    it('blocks saving invalid active date text entered through the date picker', () => {
        open([303]);
        const input = fixture.nativeElement.querySelector('p-datepicker input') as HTMLInputElement;
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }));
        input.value = 'kein Datum';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        fixture.detectChanges();
        expect(row(3).date.invalid).toBeTrue();
        expect(editor.canSave).toBeFalse();
        editor.save();
        http.expectNone(url + '/episodes');
        input.value = '';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(row(3).date.value).toBeNull();
        expect(editor.canSave).toBeTrue();
    });

    it('stages list changes separately, reveals hidden changes and resets to the original manual selection', () => {
        open([303, 305]);
        changeDate(3);
        editor.pick();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('p-picklist')).toBeTruthy();
        expect(titles()).toEqual([]);
        editor.restoreRange();
        expect(editor.target.map((e) => e.id)).toEqual([303, 304, 305, 306]);
        editor.picking = false;
        fixture.detectChanges();
        expect(titles()).toEqual(['E3 · Episode 3', 'E5 · Episode 5']);
        editor.pick();
        editor.target = [episodes.find((e) => e.id === 301)!];
        editor.applyList();
        fixture.detectChanges();
        expect(titles()).toEqual(['E1 · Episode 1']);
        expect(fixture.nativeElement.textContent).toContain('1 Änderung in einer ausgeblendeten Episode');
        editor.showChanged();
        expect(editor.visible.has(303)).toBeTrue();
        expect(row(3).date.value).toEqual(parseTracklistDate(after));
        editor.reset();
        accept();
        fixture.detectChanges();
        expect(titles()).toEqual(['E3 · Episode 3', 'E5 · Episode 5']);
        expect(editor.canSave).toBeFalse();
        expect(close).not.toHaveBeenCalled();
    });

    it('moves filtered catalogue entries with the PickList buttons and keeps list changes local until applied', fakeAsync(() => {
        open([303, 305]);
        const element = fixture.nativeElement as HTMLElement;
        function render() {
            fixture.detectChanges();
            tick();
            fixture.detectChanges();
        }
        function button(label: string) {
            const target = Array.from(element.querySelectorAll('button')).find(
                (btn) => btn.textContent?.trim() === label || btn.getAttribute('aria-label') === label,
            );
            if (!target) throw Error('Missing button: ' + label);
            target.click();
            render();
        }
        changeDate(3);
        button('Liste anpassen');
        expect(element.textContent).toContain('Ausgeblendet');
        expect(element.textContent).toContain('Im Editor angezeigt');
        const source = element.querySelector<HTMLElement>('.p-picklist-source-list-container')!;
        const filter = source.querySelector('input')!;
        filter.value = '7';
        filter.dispatchEvent(new Event('input', { bubbles: true }));
        render();
        const options = source.querySelectorAll<HTMLElement>('[role=option]');
        expect(options.length).toBe(1);
        options[0].click();
        render();
        button('Ausgewählte einblenden');
        expect(editor.target.map((e) => e.id)).toContain(307);
        button('Zurück');
        expect(titles()).toEqual(['E3 · Episode 3', 'E5 · Episode 5']);
        button('Liste anpassen');
        button('Alle ausblenden');
        button('Auswahl übernehmen');
        expect(titles()).toEqual([]);
        expect(element.textContent).toContain('Liste anpassen');
        button('Geänderte anzeigen');
        expect(titles()).toEqual(['E3 · Episode 3']);
        expect(row(3).date.value).toEqual(parseTracklistDate(after));
    }));

    it('confirms discard on Escape and keeps the entire draft when returning from confirmation', () => {
        open([301, 307]);
        expect(titles()).toEqual(['E1 · Episode 1', 'E7 · Episode 7']);
        editor.setWatched(row(1), true);
        fixture.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        expect(close).not.toHaveBeenCalled();
        expect(editor.canSave).toBeTrue();
        const closeButton = fixture.nativeElement.querySelector('[aria-label="Editor schließen"]');
        closeButton.click();
        expect(confirmation).toHaveBeenCalledTimes(2);
        accept();
        expect(close).toHaveBeenCalledOnceWith();
    });

    for (const sameEpisode of [true, false]) {
        it(
            'applies two server responses in sequence for ' +
                (sameEpisode ? 'the same episode' : 'different episodes'),
            () => {
                open();
                const tabA = editor;
                open();
                const tabB = editor;
                tabA.rows
                    .find((r) => r.episode.id === 303)!
                    .date.setValue(parseTracklistDate('2026-11-24 21:00:00'));
                tabA.save();
                const first = patch();
                expect(first.request.body.episodes.length).toBe(1);
                const previous = sighting(3, '2026-11-24 21:00:00');
                first.flush({
                    ...season,
                    tracklistEpisodes: [previous, sighting(4, before), sighting(6, null)],
                });
                const n = sameEpisode ? 3 : 4;
                changeDate(n);
                tabB.save();
                const second = patch();
                expect(second.request.body).toEqual({
                    episodes: [{ episode_id: 300 + n, watched: true, watch_date_time: after }],
                });
                const saved = {
                    ...season,
                    tracklistEpisodes: [
                        sameEpisode ? sighting(3, after) : previous,
                        sighting(4, sameEpisode ? before : after),
                        sighting(6, null),
                    ],
                };
                second.flush(saved);
                expect(updateSeason.calls.mostRecent().args[0]).toEqual(saved);
            },
        );
    }

    for (const outcome of ['partial match', 'complete match', 'remaining removal']) {
        it(
            'reconciles a timed-out PATCH against a new baseline: ' + outcome,
            fakeAsync(() => {
                open();
                changeDate(3);
                if (outcome === 'remaining removal') editor.setWatched(row(4), false);
                else changeDate(4);
                editor.save();
                if (outcome === 'remaining removal') accept();
                const first = patch();
                expect(first.request.body.episodes.length).toBe(2);
                tick(30001);
                expect(first.cancelled).toBeTrue();
                expect(editor.canSave).toBeFalse();
                editor.save();
                http.expectNone(url);
                if (outcome === 'remaining removal') {
                    editor.reconcile();
                    http.expectOne({ method: 'GET', url }).flush(null, {
                        status: 503,
                        statusText: 'Unavailable',
                    });
                    expect(editor.changed.length).toBe(2);
                    expect(editor.canSave).toBeFalse();
                }
                editor.reconcile();
                const server = {
                    ...season,
                    tracklistEpisodes: [
                        sighting(3, after),
                        sighting(4, outcome === 'complete match' ? after : before),
                        sighting(6, after),
                    ],
                };
                http.expectOne({ method: 'GET', url }).flush(server);
                fixture.detectChanges();
                http.expectNone(url + '/episodes');
                expect(updateSeason).toHaveBeenCalledOnceWith(server);
                expect(row(6).date.value).toEqual(parseTracklistDate(after));
                if (outcome === 'complete match') {
                    expect(editor.canSave).toBeFalse();
                    expect(fixture.nativeElement.textContent).toContain('Keine Änderungen');
                    return;
                }
                expect(editor.changed.map((r) => r.episode.id)).toEqual([304]);
                editor.save();
                if (outcome === 'remaining removal') {
                    http.expectNone(url + '/episodes');
                    editor.save();
                    accept();
                }
                const retry = patch();
                expect(retry.request.body).toEqual({
                    episodes: [
                        outcome === 'remaining removal'
                            ? { episode_id: 304, watched: false }
                            : { episode_id: 304, watched: true, watch_date_time: after },
                    ],
                });
                retry.flush(server);
            }),
        );
    }
});
