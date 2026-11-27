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
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { MediaDetailStateService } from '../../../../../../services/media-detail-state.service';
import {
    createSeriesEpisode,
    createSeriesMedia,
    createSeriesTracklist,
    createSeriesSeason,
    createEpisodeSighting,
} from '../../../../../../testing/media-detail.fixtures';
import { TracklistSelectionService } from '../../../../../../../tracklists/tracklist/services/tracklist-selection.service';
import { MediaDetailTvSeriesTracklistsTabComponent } from './media-detail-tv-series-tracklists-tab.component';

describe('Bulk episode selection in the series tracklists tab', () => {
    const episodes = [1, 2, 3, 4, 5, 6, 7].map((n) => createSeriesEpisode(300 + n, n));
    const sighting = (n: number, id = 700 + n, date: string | null = null) =>
        createEpisodeSighting({ id, episode: episodes[n - 1], watchDateTime: date });
    const first = createSeriesTracklist(
        { tracklistName: 'Liste A' },
        {
            startEpisodeNumber: 3,
            endEpisodeNumber: 6,
            tracklistEpisodes: [sighting(3, 703, '2026-11-20 19:00:00'), sighting(4)],
        },
    );
    const second = createSeriesTracklist({ id: 43, tracklistName: 'Liste B' }, { id: 51 });
    const bulk = '/api/tracklist-episodes/bulk';
    let state: MediaDetailStateService;
    let fixture: ComponentFixture<MediaDetailTvSeriesTracklistsTabComponent>;
    let component: MediaDetailTvSeriesTracklistsTabComponent;
    let http: HttpTestingController;
    let open: jasmine.Spy;
    let close: Subject<boolean | undefined>;

    beforeEach(() => {
        close = new Subject();
        open = jasmine.createSpy('open').and.returnValue({ onClose: close, destroy: () => {} });
        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                provideHttpClient(),
                provideHttpClientTesting(),
                provideNoopAnimations(),
                MediaDetailStateService,
                MessageService,
                { provide: TracklistSelectionService, useValue: { get: () => null, set: () => {} } },
            ],
        }).overrideComponent(MediaDetailTvSeriesTracklistsTabComponent, {
            remove: { providers: [DialogService] },
            add: { providers: [{ provide: DialogService, useValue: { open } }] },
        });
        state = TestBed.inject(MediaDetailStateService);
        http = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(MediaDetailTvSeriesTracklistsTabComponent);
        component = fixture.componentInstance;
        state.setMedia(createSeriesMedia([first, second], [createSeriesSeason({ episodes })]));
    });
    afterEach(() => http.verify());

    function render() {
        fixture.componentRef.setInput('mediaData', state.mediaData());
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
    }
    function start() {
        render();
        fixture.nativeElement.querySelector('p-accordion-header').click();
        render();
        expect(component.activeSeasonId()).toBe(20);
    }
    function find(label: string, selector = 'button', root: ParentNode = document): HTMLElement {
        const e = Array.from(root.querySelectorAll<HTMLElement>(selector)).find(
            (el) => el.textContent?.trim() === label || el.getAttribute('aria-label') === label,
        );
        if (!e) throw Error('Missing control: ' + label);
        return e;
    }
    function click(label: string, selector?: string, root?: ParentNode) {
        find(label, selector, root).click();
        render();
    }
    function select(action: string) {
        click('Episodenaktionen auswählen');
        click('Episoden auswählen und ' + action, '.p-menuitem-link, .p-tieredmenu-item-link');
    }
    function checks() {
        return Array.from<HTMLInputElement>(
            fixture.nativeElement.querySelectorAll('.episodeDIV input[type=checkbox]'),
        );
    }
    function toolbar() {
        return fixture.nativeElement.querySelector('app-episode-selection-toolbar');
    }
    function statuses() {
        return state.mediaData()!.tracklists[0].tracklistSeason!.tracklistEpisodes;
    }

    it('keeps a mobile popup positioned absolutely when PrimeNG appends it to the body', fakeAsync(() => {
        start();
        click('Episodenaktionen auswählen');
        const menu = document.body.querySelector<HTMLElement>('.p-tieredmenu-overlay')!;
        expect(menu.parentElement).toBe(document.body);
        // Karma also runs at desktop widths. Apply the class PrimeNG sets below its breakpoint.
        menu.classList.add('p-tieredmenu-mobile');
        expect(getComputedStyle(menu).position).toBe('absolute');
    }));

    it('opens the bounded editor or precisely the selected out-of-range episodes and keeps selection on cancel', fakeAsync(() => {
        start();
        click('Alle Episoden anzeigen');
        const bar = fixture.nativeElement.querySelector('.season-page-action-bar');
        expect(bar.firstElementChild.tagName.toLowerCase()).toBe('p-splitbutton');
        click('Episoden bearbeiten');
        expect(open.calls.mostRecent().args[1].data.season.id).toBe(50);
        expect(open.calls.mostRecent().args[1].data.selectedIds).toBeUndefined();
        close.next(undefined);
        select('bearbeiten');
        checks()[0].click();
        checks()[6].click();
        render();
        click('2 Episoden bearbeiten');
        expect(open.calls.mostRecent().args[1].data.selectedIds).toEqual([301, 307]);
        close.next(undefined);
        render();
        expect(checks().filter((c) => c.checked).length).toBe(2);
        expect(toolbar().textContent).toContain('2 von 7');
    }));

    it('clears all marks on switching tracklists and switching back through the rendered select', fakeAsync(() => {
        start();
        select('bearbeiten');
        checks()
            .slice(0, 3)
            .forEach((c) => c.click());
        render();
        expect(toolbar().textContent).toContain('3 von 4');
        for (const name of ['Liste B', 'Liste A']) {
            fixture.nativeElement.querySelector('p-select').click();
            render();
            click(name, '[role=option]');
            expect(toolbar()).toBeNull();
            expect(checks()).toEqual([]);
            expect(fixture.nativeElement.querySelector('.episodeDIV p-button')).toBeTruthy();
        }
        select('bearbeiten');
        expect(checks().some((c) => c.checked)).toBeFalse();
        http.expectNone((req) => req.method !== 'GET');
    }));

    it('counts only removable sightings, toggles all and restores individual actions on cancel', fakeAsync(() => {
        start();
        select('entfernen');
        expect(checks().map((e) => e.disabled)).toEqual([false, false, true, true]);
        expect((find('0 Episoden entfernen') as HTMLButtonElement).disabled).toBeTrue();
        click('Alle auswählen');
        expect(toolbar().querySelector('strong').textContent).toBe('2 von 2 ausgewählt');
        click('Alle abwählen');
        expect(toolbar().querySelector('strong').textContent).toBe('0 von 2 ausgewählt');
        click('Auswahl abbrechen');
        expect(checks()).toEqual([]);
        expect(toolbar()).toBeNull();
    }));

    for (const add of [true, false]) {
        const action = add ? 'hinzufügen' : 'entfernen';
        const confirm = add ? 'Hinzufügen' : 'Entfernen';
        it(
            'confirms ' + action + ' and updates only the returned or deleted sightings',
            fakeAsync(() => {
                start();
                select(add ? 'ohne Datum hinzufügen' : action);
                click('Alle auswählen');
                click('2 Episoden ' + action);
                expect(document.querySelector('.p-confirmdialog-message')?.textContent).toContain('Liste A');
                click('Zurück');
                expect(checks().filter((c) => c.checked).length).toBe(2);
                click('2 Episoden ' + action);
                click(confirm);
                component.proceed();
                const req = http.expectOne({ method: add ? 'POST' : 'DELETE', url: bulk });
                expect(req.request.body).toEqual(
                    add
                        ? {
                              episodes: [305, 306].map((episode_id) => ({
                                  tracklist_id: 42,
                                  tracklist_season_id: 50,
                                  episode_id,
                                  watch_date_time: null,
                              })),
                          }
                        : { tracklist_episode_ids: [703, 704] },
                );
                expect(statuses()).toEqual(first.tracklistSeason!.tracklistEpisodes);
                if (add) req.flush([sighting(6), sighting(5)], { status: 201, statusText: 'Created' });
                else req.flush(null, { status: 204, statusText: 'No Content' });
                render();
                expect(toolbar()).toBeNull();
                expect(statuses().map((te) => te.id)).toEqual(add ? [703, 704, 706, 705] : []);
                if (add) expect(statuses()[0].watchDateTime).toBe('2026-11-20 19:00:00');
                expect(fixture.nativeElement.querySelectorAll('.episodeInTracklistDIV').length).toBe(
                    add ? 4 : 0,
                );
                expect(fixture.nativeElement.querySelectorAll('.episodeDIV').length).toBe(4);
                expect(component.activeSeasonId()).toBe(20);
            }),
        );

        it(
            'reconciles the entire failed ' + action + ' batch and reconfirms surviving IDs',
            fakeAsync(() => {
                start();
                select(add ? 'ohne Datum hinzufügen' : action);
                click('Alle auswählen');
                click('2 Episoden ' + action);
                click(confirm);
                http.expectOne(bulk).flush(null, { status: add ? 409 : 404, statusText: 'Conflict' });
                render();
                expect(statuses()).toEqual(first.tracklistSeason!.tracklistEpisodes);
                expect(checks().filter((c) => c.checked).length).toBe(2);
                expect(toolbar().querySelector('[role=alert]')).toBeTruthy();
                click('Trackliste neu laden');
                const loaded = add
                    ? [...statuses(), sighting(5, 705, '2026-11-24 21:00:00')]
                    : [sighting(3, 803), sighting(4)];
                http.expectOne({ method: 'GET', url: '/api/tracklists/42' }).flush({
                    ...first,
                    tracklistSeason: { ...first.tracklistSeason, tracklistEpisodes: loaded },
                });
                render();
                expect(toolbar().textContent).toContain(add ? '1 von 1' : '1 von 2');
                expect(checks().map((c) => c.checked)).toEqual(
                    add ? [false, false, false, true] : [false, true, false, false],
                );
                click('1 Episode ' + action);
                http.expectNone(bulk);
                click(confirm);
                const retry = http.expectOne(bulk);
                expect(retry.request.body).toEqual(
                    add
                        ? {
                              episodes: [
                                  {
                                      tracklist_id: 42,
                                      tracklist_season_id: 50,
                                      episode_id: 306,
                                      watch_date_time: null,
                                  },
                              ],
                          }
                        : { tracklist_episode_ids: [704] },
                );
                if (add) retry.flush([sighting(6)], { status: 201, statusText: 'Created' });
                else retry.flush(null, { status: 204, statusText: 'No Content' });
                render();
                expect(statuses()).toEqual(add ? [...loaded, sighting(6)] : [sighting(3, 803)]);
            }),
        );
    }
});
