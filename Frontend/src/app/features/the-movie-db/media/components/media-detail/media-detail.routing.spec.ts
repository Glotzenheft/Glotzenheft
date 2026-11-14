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

import {Location} from '@angular/common';
import {provideLocationMocks} from '@angular/common/testing';
import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {NavigationEnd, provideRouter, Router, RouterOutlet, withComponentInputBinding} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {MessageService} from 'primeng/api';
import {Tab, TabList, Tabs} from 'primeng/tabs';
import {filter, firstValueFrom, of, take} from 'rxjs';
import {MediaDetailComponent} from './media-detail.component';
import {MEDIA_DETAIL_ROUTES} from './media-detail.routes';
import {MediaDetailService} from '../../services/media-detail.service';
import {createMediaDetailResponse} from '../../testing/media-detail.fixtures';

@Component({standalone: true, template: 'Child content'})
class TabContentStubComponent {}

describe('MediaDetailComponent routing', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({providers: [
            provideNoopAnimations(), provideLocationMocks(), MessageService,
            {provide: MediaDetailService, useValue: {getMedia: () => of(createMediaDetailResponse())}},
            provideRouter([{
                path: 'tmdb/media/:mediaType/:mediaId',
                children: MEDIA_DETAIL_ROUTES.map(route => ({
                    ...route,
                    children: route.children?.map(child => child.loadComponent
                        ? {...child, loadComponent: undefined, component: TabContentStubComponent}
                        : child),
                })),
            }], withComponentInputBinding()),
        ]});
        // Keep the real tab controls and router outlet while isolating unrelated metadata and APIs.
        TestBed.overrideComponent(MediaDetailComponent, {set: {imports: [Tabs, TabList, Tab, RouterOutlet], template: `
            <p-tabs [value]="activeTab()" (valueChange)="onTabChange($event)">
                <p-tablist>
                    <p-tab value="tracklists">Tracklisten</p-tab>
                    <p-tab value="recommendations">Ähnliches</p-tab>
                </p-tablist>
            </p-tabs><router-outlet />
        `}});
    });

    for (const mediaType of ['movie', 'tv']) {
        it(`selects recommendations when opening a ${mediaType} URL directly`, async () => {
            const harness = await RouterTestingHarness.create();
            const component = await harness.navigateByUrl(`/tmdb/media/${mediaType}/10/recommendations`, MediaDetailComponent);
            expect(component.activeTab()).toBe('recommendations');
            expect(harness.routeNativeElement!.querySelector('p-tab[value="recommendations"]')!.getAttribute('aria-selected')).toBe('true');
        });
    }

    it('selects tracklists after the default redirect', async () => {
        const harness = await RouterTestingHarness.create();
        const component = await harness.navigateByUrl('/tmdb/media/movie/10', MediaDetailComponent);
        expect(TestBed.inject(Router).url).toBe('/tmdb/media/movie/10/tracklists');
        expect(component.activeTab()).toBe('tracklists');
    });

    it('lets the tracklists tab return from a directly opened recommendations URL', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/tmdb/media/movie/10/recommendations', MediaDetailComponent);
        (harness.routeNativeElement!.querySelector('p-tab[value="tracklists"]') as HTMLElement).click();
        await harness.fixture.whenStable();
        expect(TestBed.inject(Router).url).toBe('/tmdb/media/movie/10/tracklists');
    });

    it('keeps the selected tab in sync with back and forward navigation', async () => {
        const harness = await RouterTestingHarness.create();
        const component = await harness.navigateByUrl('/tmdb/media/movie/10/tracklists', MediaDetailComponent);
        const router = TestBed.inject(Router);
        // The harness navigates without bootstrapping the app's location-change listener.
        router.initialNavigation();
        const reused = await harness.navigateByUrl('/tmdb/media/movie/10/recommendations', MediaDetailComponent);
        expect(reused).toBe(component);
        expect(component.activeTab()).toBe('recommendations');

        const location = TestBed.inject(Location);
        const back = firstValueFrom(router.events.pipe(filter(event => event instanceof NavigationEnd), take(1)));
        location.back();
        await back;
        harness.detectChanges();
        expect(component.activeTab()).toBe('tracklists');
        expect(harness.routeNativeElement!.querySelector('p-tab[value="tracklists"]')!.getAttribute('aria-selected')).toBe('true');

        const forward = firstValueFrom(router.events.pipe(filter(event => event instanceof NavigationEnd), take(1)));
        location.forward();
        await forward;
        harness.detectChanges();
        expect(component.activeTab()).toBe('recommendations');
        expect(harness.routeNativeElement!.querySelector('p-tab[value="recommendations"]')!.getAttribute('aria-selected')).toBe('true');
    });
});
