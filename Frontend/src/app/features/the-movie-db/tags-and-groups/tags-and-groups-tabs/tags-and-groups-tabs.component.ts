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

import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Tab, TabList, Tabs} from 'primeng/tabs';

import {
    TRACKLIST_TAG_PATHS,
    TRACKLIST_TAG_FILTER_PATHS,
    GROUPS_PATHS
} from '../../../../core/constants/paths.constants';

@Component({
  selector: 'app-tags-and-groups-tabs',
    imports: [
        Tab,
        TabList,
        Tabs
    ],
  templateUrl: './tags-and-groups-tabs.component.html',
  styleUrl: './tags-and-groups-tabs.component.css'
})
export class TagsAndGroupsTabsComponent implements OnInit{
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    public isVisible = signal<boolean>(true);
    public currentTab = signal<string>('');

    public readonly tabs = [
        { route: TRACKLIST_TAG_PATHS.base, label: 'Tags' },
        { route: TRACKLIST_TAG_FILTER_PATHS.base, label: 'Tag Filter' },
        { route: GROUPS_PATHS.base, label: 'Gruppen'}
    ]

    constructor()
    {
        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntilDestroyed()
            )
            .subscribe((event: NavigationEnd) => {
                this.updateCurrentTabFromUrl(event.urlAfterRedirects);
            });
    }

    ngOnInit() {
        this.updateCurrentTabFromUrl(this.router.url);
    }

    public onTabChange(newTabRoute: string | number) {
        const routeStr: string = newTabRoute.toString();
        this.currentTab.set(routeStr)
        void this.router.navigate([routeStr], { relativeTo: this.route });
    }

    private updateCurrentTabFromUrl(url: string): void {
        const urlSegments = url.split('?')[0].split('/');
        const lastSegment = urlSegments[urlSegments.length - 1];

        const activeTab = this.tabs.find(tab => tab.route === lastSegment);

        if (activeTab) {
            this.isVisible.set(true);
            this.currentTab.set(activeTab.route);
        } else if (lastSegment === 'tags-and-groups') {
            this.isVisible.set(true);
        } else {
            this.isVisible.set(false);
        }
    }
}
